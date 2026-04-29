import { Card, Empty, Space, Tag, Typography } from 'antd';
import { Link, useLocation } from 'umi';
import { useMemo } from 'react';
import { useModel } from 'umi';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { formatDateTime } from '@/services/blogCaNhan/utils';

const BlogDetailPage = () => {
	const location = useLocation();
	const slug = useMemo(() => location.pathname.split('/').filter(Boolean).pop() || '', [location.pathname]);
	const { findPostBySlug, relatedPosts, getTagsByIds } = useModel('blogCaNhan');
	const post = findPostBySlug(slug);
	const related = relatedPosts(slug);

	if (!post) {
		return (
			<Card>
				<Empty description='Không tìm thấy bài viết' />
				<div style={{ textAlign: 'center', marginTop: 16 }}>
					<Link to='/blog-ca-nhan/trang-chu'>Quay về trang chủ</Link>
				</div>
			</Card>
		);
	}

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card>
				<Typography.Title level={2} style={{ marginTop: 0 }}>
					{post.title}
				</Typography.Title>
				<Space wrap style={{ marginBottom: 16 }}>
					<Tag color={post.status === 'published' ? 'green' : 'gold'}>
						{post.status === 'published' ? 'Đã đăng' : 'Nháp'}
					</Tag>
					{getTagsByIds(post.tagIds).map((tag) => (
						<Tag key={tag.id}>{tag.name}</Tag>
					))}
				</Space>
				<Typography.Paragraph type='secondary'>
					Đăng ngày: {formatDateTime(post.publishedAt || post.createdAt)}
				</Typography.Paragraph>
				{post.coverImage ? (
					<img src={post.coverImage} alt={post.title} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />
				) : null}
				<MarkdownRenderer content={post.content} />
			</Card>

			<Card title='Bài viết liên quan'>
				{related.length ? (
					<Space direction='vertical' style={{ width: '100%' }}>
						{related.map((item) => (
							<Card
								size='small'
								key={item.id}
								title={item.title}
								extra={<Link to={`/blog-ca-nhan/bai-viet/${item.slug}`}>Xem</Link>}
							>
								<Typography.Paragraph style={{ marginBottom: 8 }}>{item.excerpt}</Typography.Paragraph>
								<Space wrap>
									{getTagsByIds(item.tagIds).map((tag) => (
										<Tag key={tag.id}>{tag.name}</Tag>
									))}
								</Space>
							</Card>
						))}
					</Space>
				) : (
					<Empty description='Chưa có bài liên quan' />
				)}
			</Card>
		</Space>
	);
};

export default BlogDetailPage;
