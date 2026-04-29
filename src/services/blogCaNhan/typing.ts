export type BlogPostStatus = 'draft' | 'published';

export type BlogTag = {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
};

export type BlogAuthor = {
	name: string;
	title: string;
	bio: string;
	email: string;
	avatarUrl: string;
	location: string;
	website?: string;
	github?: string;
	linkedin?: string;
};

export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	coverImage?: string;
	status: BlogPostStatus;
	tagIds: string[];
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
};

export type BlogPostInput = {
	title: string;
	slug?: string;
	excerpt: string;
	content: string;
	coverImage?: string;
	status: BlogPostStatus;
	tagIds: string[];
};

export type BlogTagInput = {
	name: string;
	slug?: string;
};

export type BlogPostFilters = {
	keyword?: string;
	tagId?: string;
	status?: BlogPostStatus | 'all';
};

export const BLOG_POST_STATUS_OPTIONS: Array<{ label: string; value: BlogPostStatus }> = [
	{ label: 'Nháp', value: 'draft' },
	{ label: 'Đã đăng', value: 'published' },
];
