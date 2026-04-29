import { useMemo, useState } from 'react';
import {
	BlogAuthor,
	BlogPost,
	BlogPostFilters,
	BlogPostInput,
	BlogTag,
	BlogTagInput,
} from '@/services/blogCaNhan/typing';
import { getAuthor } from '@/services/blogCaNhan/author.service';
import {
	createPost,
	deletePost,
	filterPosts,
	getPostBySlug,
	getPosts,
	getRelatedPosts,
	updatePost,
} from '@/services/blogCaNhan/post.service';
import { createTag, deleteTag, getTagUsageCount, getTags, updateTag } from '@/services/blogCaNhan/tag.service';

const DEFAULT_FILTERS: BlogPostFilters = {
	keyword: '',
	tagId: undefined,
	status: 'all',
};

export default () => {
	const [posts, setPosts] = useState<BlogPost[]>(() => getPosts());
	const [tags, setTags] = useState<BlogTag[]>(() => getTags());
	const [author] = useState<BlogAuthor>(() => getAuthor());
	const [postFilters, setPostFilters] = useState<BlogPostFilters>(DEFAULT_FILTERS);

	const publishedPosts = useMemo(
		() =>
			[...posts]
				.filter((post) => post.status === 'published')
				.sort(
					(a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime(),
				),
		[posts],
	);

	const filteredPosts = useMemo(() => filterPosts(posts, postFilters), [posts, postFilters]);

	const refresh = () => {
		setPosts(getPosts());
		setTags(getTags());
	};

	const addPost = (payload: BlogPostInput) => {
		try {
			const next = createPost(payload, tags);
			setPosts(next);
			return { success: true, message: 'Thêm bài viết thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Thêm bài viết thất bại.' };
		}
	};

	const editPost = (postId: string, payload: BlogPostInput) => {
		try {
			const next = updatePost(postId, payload, tags);
			setPosts(next);
			return { success: true, message: 'Cập nhật bài viết thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Cập nhật bài viết thất bại.' };
		}
	};

	const removePost = (postId: string) => {
		try {
			const next = deletePost(postId);
			setPosts(next);
			return { success: true, message: 'Xóa bài viết thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Xóa bài viết thất bại.' };
		}
	};

	const addTag = (payload: BlogTagInput) => {
		try {
			const next = createTag(payload);
			setTags(next);
			return { success: true, message: 'Thêm thẻ thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Thêm thẻ thất bại.' };
		}
	};

	const editTag = (tagId: string, payload: BlogTagInput) => {
		try {
			const next = updateTag(tagId, payload);
			setTags(next);
			return { success: true, message: 'Cập nhật thẻ thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Cập nhật thẻ thất bại.' };
		}
	};

	const removeTag = (tagId: string) => {
		try {
			const next = deleteTag(tagId);
			setTags(next);
			return { success: true, message: 'Xóa thẻ thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Xóa thẻ thất bại.' };
		}
	};

	const getTagsByIds = (tagIds: string[]) => tags.filter((tag) => tagIds.includes(tag.id));
	const findPostBySlug = (slug: string) => getPostBySlug(slug);
	const relatedPosts = (slug: string) => getRelatedPosts(posts, slug);
	const tagUsageCount = (tagId: string) => getTagUsageCount(tagId);

	return {
		author,
		posts,
		tags,
		publishedPosts,
		filteredPosts,
		postFilters,
		setPostFilters,
		DEFAULT_FILTERS,
		refresh,
		addPost,
		editPost,
		removePost,
		addTag,
		editTag,
		removeTag,
		getTagsByIds,
		findPostBySlug,
		relatedPosts,
		tagUsageCount,
	};
};
