import { BlogPost, BlogPostFilters, BlogPostInput, BlogTag } from './typing';
import { createId, makeExcerpt, normalizeText, slugify } from './utils';
import { loadPosts, savePosts } from './storage.service';

const ensureUniqueSlug = (posts: BlogPost[], slug: string, excludeId?: string) => {
	let nextSlug = slugify(slug);
	let suffix = 1;
	while (posts.some((post) => post.id !== excludeId && post.slug === nextSlug)) {
		nextSlug = `${slugify(slug)}-${suffix}`;
		suffix += 1;
	}
	return nextSlug;
};

const normalizePost = (input: BlogPostInput, tags: BlogTag[], posts: BlogPost[], excludeId?: string): BlogPost => {
	if (!input.title.trim()) throw new Error('Tiêu đề không được để trống.');
	if (!input.excerpt.trim()) throw new Error('Mô tả ngắn không được để trống.');
	if (!input.content.trim()) throw new Error('Nội dung không được để trống.');

	const titleSlug = input.slug?.trim() ? input.slug.trim() : input.title;
	const slug = ensureUniqueSlug(posts, titleSlug, excludeId);
	const now = new Date().toISOString();
	const finalTagIds = input.tagIds.filter((tagId) => tags.some((tag) => tag.id === tagId));

	return {
		id: createId('post'),
		title: input.title.trim(),
		slug,
		excerpt: input.excerpt.trim(),
		content: input.content.trim(),
		coverImage: input.coverImage?.trim() || undefined,
		status: input.status,
		tagIds: finalTagIds,
		createdAt: now,
		updatedAt: now,
		publishedAt: input.status === 'published' ? now : undefined,
	};
};

export const getPosts = () => loadPosts();

export const getPostBySlug = (slug: string) => loadPosts().find((post) => post.slug === slug);

export const createPost = (input: BlogPostInput, tags: BlogTag[]) => {
	const posts = loadPosts();
	const record = normalizePost(input, tags, posts);
	const next = [record, ...posts];
	savePosts(next);
	return next;
};

export const updatePost = (postId: string, input: BlogPostInput, tags: BlogTag[]) => {
	const posts = loadPosts();
	const current = posts.find((post) => post.id === postId);
	if (!current) throw new Error('Không tìm thấy bài viết cần cập nhật.');
	const normalizedSlug = ensureUniqueSlug(posts, input.slug?.trim() ? input.slug.trim() : input.title, postId);
	const now = new Date().toISOString();
	const next = posts.map((post) =>
		post.id === postId
			? {
					...post,
					title: input.title.trim(),
					slug: normalizedSlug,
					excerpt: input.excerpt.trim(),
					content: input.content.trim(),
					coverImage: input.coverImage?.trim() || undefined,
					status: input.status,
					tagIds: input.tagIds.filter((tagId) => tags.some((tag) => tag.id === tagId)),
					updatedAt: now,
					publishedAt: input.status === 'published' ? current.publishedAt || now : undefined,
			  }
			: post,
	);
	savePosts(next);
	return next;
};

export const deletePost = (postId: string) => {
	const posts = loadPosts();
	const next = posts.filter((post) => post.id !== postId);
	if (next.length === posts.length) throw new Error('Không tìm thấy bài viết cần xóa.');
	savePosts(next);
	return next;
};

export const filterPosts = (posts: BlogPost[], filters: BlogPostFilters) => {
	return posts.filter((post) => {
		if (filters.status && filters.status !== 'all' && post.status !== filters.status) return false;
		if (filters.tagId && !post.tagIds.includes(filters.tagId)) return false;
		if (filters.keyword) {
			const keyword = normalizeText(filters.keyword);
			const matched =
				normalizeText(post.title).includes(keyword) ||
				normalizeText(post.slug).includes(keyword) ||
				normalizeText(post.content).includes(keyword) ||
				normalizeText(post.excerpt).includes(keyword);
			if (!matched) return false;
		}
		return true;
	});
};

export const getRelatedPosts = (posts: BlogPost[], slug: string, limit = 3) => {
	const current = posts.find((post) => post.slug === slug);
	if (!current) return [];
	return posts
		.filter((post) => post.slug !== slug && post.status === 'published')
		.sort((a, b) => {
			const sharedTags =
				b.tagIds.filter((tagId) => current.tagIds.includes(tagId)).length -
				a.tagIds.filter((tagId) => current.tagIds.includes(tagId)).length;
			if (sharedTags !== 0) return sharedTags;
			return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
		})
		.slice(0, limit);
};

export const buildPostExcerpt = (content: string) => makeExcerpt(content, 160);
