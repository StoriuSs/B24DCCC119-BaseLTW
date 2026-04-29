import { Button, Card, Empty, Popconfirm, Space, Table, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import TagEditorModal from '../components/TagEditorModal';
import { BlogTag, BlogTagInput } from '@/services/blogCaNhan/typing';
import { formatDateTime } from '@/services/blogCaNhan/utils';

const BlogAdminTagsPage = () => {
	const { tags, addTag, editTag, removeTag, tagUsageCount } = useModel('blogCaNhan');
	const [visible, setVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<BlogTag>();

	const sortedTags = useMemo(
		() => [...tags].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
		[tags],
	);

	const handleSubmit = (payload: BlogTagInput) => {
		const result = editingTag ? editTag(editingTag.id, payload) : addTag(payload);
		if (result.success) {
			message.success(result.message);
			setVisible(false);
			setEditingTag(undefined);
		} else {
			message.error(result.message);
		}
	};

	return (
		<Card
			title='Quản lý thẻ'
			extra={
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingTag(undefined);
						setVisible(true);
					}}
				>
					Thêm thẻ
				</Button>
			}
		>
			<Table<BlogTag>
				rowKey='id'
				dataSource={sortedTags}
				pagination={{ pageSize: 8 }}
				locale={{ emptyText: <Empty description='Chưa có thẻ nào' /> }}
				scroll={{ x: 760 }}
				columns={[
					{ title: 'Tên thẻ', dataIndex: 'name', width: 220 },
					{ title: 'Slug', dataIndex: 'slug', width: 180 },
					{
						title: 'Đang dùng',
						width: 120,
						render: (_, record) => <Tag color='blue'>{tagUsageCount(record.id)} bài</Tag>,
					},
					{ title: 'Cập nhật', width: 160, render: (_, record) => formatDateTime(record.updatedAt) },
					{
						title: 'Thao tác',
						width: 160,
						render: (_, record) => (
							<Space>
								<Button
									icon={<EditOutlined />}
									onClick={() => {
										setEditingTag(record);
										setVisible(true);
									}}
								>
									Sửa
								</Button>
								<Popconfirm
									title='Xóa thẻ này?'
									description={tagUsageCount(record.id) > 0 ? 'Thẻ đang được sử dụng và sẽ không thể xóa.' : undefined}
									onConfirm={() => {
										const result = removeTag(record.id);
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

			<TagEditorModal
				visible={visible}
				editingTag={editingTag}
				onCancel={() => {
					setVisible(false);
					setEditingTag(undefined);
				}}
				onSubmit={handleSubmit}
			/>
		</Card>
	);
};

export default BlogAdminTagsPage;
