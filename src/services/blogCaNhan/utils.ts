export const BLOG_POST_STORAGE_KEY = 'blog-ca-nhan-posts';
export const BLOG_TAG_STORAGE_KEY = 'blog-ca-nhan-tags';

export const slugify = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const normalizeText = (value: string) => value.trim().toLowerCase();

export const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const formatDateTime = (isoString?: string) => {
	if (!isoString) return '-';
	return new Date(isoString).toLocaleString('vi-VN', {
		dateStyle: 'short',
		timeStyle: 'short',
	});
};

export const stripMarkdown = (content: string) =>
	content
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[[^\]]*\]\(([^)]*)\)/g, '$1')
		.replace(/[>#*_`~-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

export const makeExcerpt = (content: string, maxLength = 140) => {
	const plain = stripMarkdown(content);
	if (plain.length <= maxLength) return plain;
	return `${plain.slice(0, maxLength).trim()}...`;
};
