import { BLOG_POST_STORAGE_KEY, BLOG_TAG_STORAGE_KEY, createId, slugify } from './utils';
import { BlogAuthor, BlogPost, BlogTag } from './typing';

const seedAuthor: BlogAuthor = {
	name: 'Nguyễn Văn A',
	title: 'Sinh viên yêu thích viết lách và lập trình',
	bio: 'Mình ghi lại kiến thức, bài học thực hành và những thứ thú vị trong quá trình học lập trình web.',
	email: 'nguyenvana@example.com',
	avatarUrl: 'https://i.pravatar.cc/320?img=12',
	location: 'Hà Nội, Việt Nam',
	website: 'https://example.com',
	github: 'https://github.com/example',
	linkedin: 'https://www.linkedin.com',
};

const seedTags: BlogTag[] = [
	{
		id: createId('tag'),
		name: 'Học tập',
		slug: slugify('Học tập'),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: createId('tag'),
		name: 'React',
		slug: slugify('React'),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: createId('tag'),
		name: 'Thực hành',
		slug: slugify('Thực hành'),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: createId('tag'),
		name: 'Ghi chú',
		slug: slugify('Ghi chú'),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

const seedPosts: BlogPost[] = [
	{
		id: createId('post'),
		title: 'Bắt đầu với blog cá nhân',
		slug: slugify('Bắt đầu với blog cá nhân'),
		excerpt: 'Khởi tạo blog cá nhân với dữ liệu localStorage và bố cục dễ đọc trên mobile.',
		content:
			'# Bắt đầu với blog cá nhân\n\nĐây là bài viết mẫu để kiểm tra luồng đọc bài viết, lọc thẻ và hiển thị Markdown.',
		status: 'published',
		tagIds: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		publishedAt: new Date().toISOString(),
	},
	{
		id: createId('post'),
		title: 'Ghi chú khi làm giao diện quản lý',
		slug: slugify('Ghi chú khi làm giao diện quản lý'),
		excerpt: 'Một số lưu ý nhỏ khi dựng form, table và modal cho khu vực quản trị.',
		content: '## Ghi chú\n\n- Dùng form rõ ràng\n- Giữ thao tác đơn giản\n- Tối ưu cho mobile',
		status: 'draft',
		tagIds: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

const parseList = <T>(value: string | null): T[] => {
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const persistList = (key: string, value: unknown[]) => {
	localStorage.setItem(key, JSON.stringify(value));
};

const ensureSeedList = <T>(key: string, seedValue: T[]): T[] => {
	const current = parseList<T>(localStorage.getItem(key));
	if (current.length > 0) return current;
	persistList(key, seedValue as unknown[]);
	return seedValue;
};

export const loadAuthor = () => seedAuthor;

export const loadTags = () => ensureSeedList<BlogTag>(BLOG_TAG_STORAGE_KEY, seedTags);

export const saveTags = (tags: BlogTag[]) => persistList(BLOG_TAG_STORAGE_KEY, tags);

export const loadPosts = () => ensureSeedList<BlogPost>(BLOG_POST_STORAGE_KEY, seedPosts);

export const savePosts = (posts: BlogPost[]) => persistList(BLOG_POST_STORAGE_KEY, posts);
