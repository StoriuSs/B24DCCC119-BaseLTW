import { Card, Col, Empty, Pagination, Row, Space, Statistic, Tag, Typography } from 'antd';
import { Link } from 'umi';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import PostFilters from '../components/PostFilters';
import { filterPosts } from '@/services/blogCaNhan/post.service';

const PAGE_SIZE = 6;

const BlogHomePage = () => {
	const { posts, tags, getTagsByIds } = useModel('blogCaNhan');
	const [keyword, setKeyword] = useState('');
	const [tagId, setTagId] = useState<string | undefined>(undefined);
	const [status, setStatus] = useState<'all' | 'draft' | 'published'>('published');
	const [page, setPage] = useState(1);

	const filteredPosts = useMemo(() => filterPosts(posts, { keyword, tagId, status }), [posts, keyword, tagId, status]);

	const pagePosts = useMemo(() => filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredPosts, page]);

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} lg={14}>
						<Typography.Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
							Blog cá nhân
						</Typography.Title>
						<Typography.Paragraph style={{ marginBottom: 0 }}>
							Bài viết, ghi chú và trải nghiệm học tập được sắp xếp thành một luồng đọc dễ theo dõi trên desktop lẫn
							mobile.
						</Typography.Paragraph>
					</Col>
					<Col xs={24} lg={10}>
						<Row gutter={[12, 12]}>
							<Col xs={24} sm={8}>
								<Card
									size='small'
									bordered={false}
									style={{ background: '#f6ffed', height: '100%' }}
									bodyStyle={{ minHeight: 100 }}
								>
									<Statistic
										title='Bài viết đã đăng'
										value={posts.filter((post) => post.status === 'published').length}
									/>
								</Card>
							</Col>
							<Col xs={24} sm={8}>
								<Card
									size='small'
									bordered={false}
									style={{ background: '#e6f7ff', height: '100%' }}
									bodyStyle={{ minHeight: 100 }}
								>
									<Statistic title='Số thẻ' value={tags.length} />
								</Card>
							</Col>
							<Col xs={24} sm={8}>
								<Card
									size='small'
									bordered={false}
									style={{ background: '#fff7e6', height: '100%' }}
									bodyStyle={{ minHeight: 100 }}
								>
									<Statistic title='Kết quả lọc' value={filteredPosts.length} />
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>
			</Card>

			<Card>
				<PostFilters
					keyword={keyword}
					tagId={tagId}
					status={status}
					tags={tags}
					onKeywordChange={(value) => {
						setKeyword(value);
						setPage(1);
					}}
					onTagChange={(value) => {
						setTagId(value);
						setPage(1);
					}}
					onStatusChange={(value) => {
						setStatus(value ?? 'published');
						setPage(1);
					}}
					onReset={() => {
						setKeyword('');
						setTagId(undefined);
						setStatus('published');
						setPage(1);
					}}
				/>
			</Card>

			{pagePosts.length ? (
				<Row gutter={[16, 16]}>
					{pagePosts.map((post) => (
						<Col xs={24} md={12} xl={8} key={post.id}>
							<Card
								title={post.title}
								extra={<Tag color='green'>Đã đăng</Tag>}
								actions={[
									<Link key='detail' to={`/blog-ca-nhan/bai-viet/${post.slug}`}>
										Đọc tiếp
									</Link>,
								]}
							>
								<Typography.Paragraph ellipsis={{ rows: 4 }}>{post.excerpt}</Typography.Paragraph>
								<Space wrap>
									{getTagsByIds(post.tagIds).map((tag) => (
										<Tag key={tag.id}>{tag.name}</Tag>
									))}
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			) : (
				<Card>
					<Empty description='Không có bài viết phù hợp' />
				</Card>
			)}

			<Card style={{ textAlign: 'right' }}>
				<Pagination
					current={page}
					pageSize={PAGE_SIZE}
					total={filteredPosts.length}
					onChange={(nextPage) => setPage(nextPage)}
					hideOnSinglePage
				/>
			</Card>
		</Space>
	);
};

export default BlogHomePage;
