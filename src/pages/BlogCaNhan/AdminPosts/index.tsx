import { Button, Card, Empty, Popconfirm, Space, Table, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import PostEditorModal from '../components/PostEditorModal';
import { BlogPost, BlogPostInput } from '@/services/blogCaNhan/typing';
import { formatDateTime } from '@/services/blogCaNhan/utils';

const BlogAdminPostsPage = () => {
	const { posts, tags, addPost, editPost, removePost, getTagsByIds } = useModel('blogCaNhan');
	const [visible, setVisible] = useState(false);
	const [editingPost, setEditingPost] = useState<BlogPost>();

	const sortedPosts = useMemo(
		() => [...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
		[posts],
	);

	const handleSubmit = (payload: BlogPostInput) => {
		const result = editingPost ? editPost(editingPost.id, payload) : addPost(payload);
		if (result.success) {
			message.success(result.message);
			setVisible(false);
			setEditingPost(undefined);
		} else {
			message.error(result.message);
		}
	};

	return (
		<Card
			title='Quản lý bài viết'
			extra={
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingPost(undefined);
						setVisible(true);
					}}
				>
					Thêm bài viết
				</Button>
			}
		>
			<Table<BlogPost>
				rowKey='id'
				dataSource={sortedPosts}
				pagination={{ pageSize: 8 }}
				locale={{ emptyText: <Empty description='Chưa có bài viết nào' /> }}
				scroll={{ x: 1100 }}
				columns={[
					{ title: 'Tiêu đề', dataIndex: 'title', width: 220 },
					{ title: 'Slug', dataIndex: 'slug', width: 180 },
					{
						title: 'Trạng thái',
						dataIndex: 'status',
						width: 120,
						render: (value) => (
							<Tag color={value === 'published' ? 'green' : 'gold'}>{value === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
						),
					},
					{
						title: 'Thẻ',
						width: 220,
						render: (_, record) => (
							<Space wrap>
								{getTagsByIds(record.tagIds).map((tag) => (
									<Tag key={tag.id}>{tag.name}</Tag>
								))}
							</Space>
						),
					},
					{ title: 'Cập nhật', width: 160, render: (_, record) => formatDateTime(record.updatedAt) },
					{
						title: 'Thao tác',
						width: 180,
						render: (_, record) => (
							<Space>
								<Button
									icon={<EditOutlined />}
									onClick={() => {
										setEditingPost(record);
										setVisible(true);
									}}
								>
									Sửa
								</Button>
								<Popconfirm
									title='Xóa bài viết này?'
									onConfirm={() => {
										const result = removePost(record.id);
										if (result.success) message.success(result.message);
										else message.error(result.message);
									}}
								>
									<Button danger icon={<DeleteOutlined />}>
										Xóa
									</Button>
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>

			<PostEditorModal
				visible={visible}
				editingPost={editingPost}
				tags={tags}
				onCancel={() => {
					setVisible(false);
					setEditingPost(undefined);
				}}
				onSubmit={handleSubmit}
			/>
		</Card>
	);
};

export default BlogAdminPostsPage;
