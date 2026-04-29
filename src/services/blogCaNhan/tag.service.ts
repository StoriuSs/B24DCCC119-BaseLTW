import { BlogTag, BlogTagInput } from './typing';
import { createId, normalizeText, slugify } from './utils';
import { loadPosts, loadTags, saveTags } from './storage.service';

const ensureUniqueSlug = (tags: BlogTag[], slug: string, excludeId?: string) => {
	let nextSlug = slugify(slug);
	let suffix = 1;
	while (tags.some((tag) => tag.id !== excludeId && tag.slug === nextSlug)) {
		nextSlug = `${slugify(slug)}-${suffix}`;
		suffix += 1;
	}
	return nextSlug;
};

export const getTags = () => loadTags();

export const getTagUsageCount = (tagId: string) => loadPosts().filter((post) => post.tagIds.includes(tagId)).length;

export const createTag = (input: BlogTagInput) => {
	if (!input.name.trim()) throw new Error('Tên thẻ không được để trống.');
	const tags = loadTags();
	const slug = ensureUniqueSlug(tags, input.slug?.trim() ? input.slug.trim() : input.name);
	if (tags.some((tag) => normalizeText(tag.name) === normalizeText(input.name))) {
		throw new Error('Tên thẻ đã tồn tại.');
	}
	const now = new Date().toISOString();
	const next = [
		{
			id: createId('tag'),
			name: input.name.trim(),
			slug,
			createdAt: now,
			updatedAt: now,
		},
		...tags,
	];
	saveTags(next);
	return next;
};

export const updateTag = (tagId: string, input: BlogTagInput) => {
	if (!input.name.trim()) throw new Error('Tên thẻ không được để trống.');
	const tags = loadTags();
	const current = tags.find((tag) => tag.id === tagId);
	if (!current) throw new Error('Không tìm thấy thẻ cần cập nhật.');
	if (tags.some((tag) => tag.id !== tagId && normalizeText(tag.name) === normalizeText(input.name))) {
		throw new Error('Tên thẻ đã tồn tại.');
	}
	const slug = ensureUniqueSlug(tags, input.slug?.trim() ? input.slug.trim() : input.name, tagId);
	const now = new Date().toISOString();
	const next = tags.map((tag) =>
		tag.id === tagId
			? {
					...tag,
					name: input.name.trim(),
					slug,
					updatedAt: now,
			  }
			: tag,
	);
	saveTags(next);
	return next;
};

export const deleteTag = (tagId: string) => {
	const tags = loadTags();
	const usageCount = getTagUsageCount(tagId);
	if (usageCount > 0) throw new Error('Không thể xóa thẻ đang được sử dụng.');
	const next = tags.filter((tag) => tag.id !== tagId);
	if (next.length === tags.length) throw new Error('Không tìm thấy thẻ cần xóa.');
	saveTags(next);
	return next;
};
