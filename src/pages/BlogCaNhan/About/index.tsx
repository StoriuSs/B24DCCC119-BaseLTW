import { Card, Descriptions, Space, Tag, Typography } from 'antd';
import { useModel } from 'umi';

const BlogAboutPage = () => {
	const { author, publishedPosts, tags } = useModel('blogCaNhan');

	return (
		<Space direction='vertical' size={16} style={{ width: '100%' }}>
			<Card>
				<Space align='start' size={16} style={{ width: '100%' }}>
					<img
						src={author.avatarUrl}
						alt={author.name}
						style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
					/>
					<div style={{ flex: 1 }}>
						<Typography.Title level={2} style={{ marginTop: 0 }}>
							{author.name}
						</Typography.Title>
						<Typography.Paragraph type='secondary' style={{ marginBottom: 8 }}>
							{author.title}
						</Typography.Paragraph>
						<Typography.Paragraph>{author.bio}</Typography.Paragraph>
						<Space wrap>
							{author.website ? <a href={author.website}>Website</a> : null}
							{author.github ? <a href={author.github}>GitHub</a> : null}
							{author.linkedin ? <a href={author.linkedin}>LinkedIn</a> : null}
						</Space>
					</div>
				</Space>
			</Card>

			<Card title='Thông tin tác giả'>
				<Descriptions bordered column={1} size='small'>
					<Descriptions.Item label='Email'>{author.email}</Descriptions.Item>
					<Descriptions.Item label='Địa điểm'>{author.location}</Descriptions.Item>
					<Descriptions.Item label='Tổng bài viết'>{publishedPosts.length}</Descriptions.Item>
					<Descriptions.Item label='Tổng thẻ'>{tags.length}</Descriptions.Item>
				</Descriptions>
			</Card>

			<Card title='Chủ đề nổi bật'>
				<Space wrap>
					{tags.map((tag) => (
						<Tag key={tag.id}>{tag.name}</Tag>
					))}
				</Space>
			</Card>
		</Space>
	);
};

export default BlogAboutPage;
