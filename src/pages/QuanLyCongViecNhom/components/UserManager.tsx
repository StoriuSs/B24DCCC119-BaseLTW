import React, { useEffect, useState } from 'react';
import { Button, Empty, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { QLCVNUser } from '@/pages/QuanLyCongViecNhom/typing';

interface UserManagerProps {
	users: QLCVNUser[];
	currentUserId?: string;
	onAdd: (name: string, password: string) => void;
	onUpdate: (userId: string, name: string, password?: string) => void;
	onDelete: (user: QLCVNUser) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, currentUserId, onAdd, onUpdate, onDelete }) => {
	const [visible, setVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<QLCVNUser>();
	const [form] = Form.useForm<{ name: string; password?: string }>();

	useEffect(() => {
		if (!visible) return;
		form.setFieldsValue({ name: editingUser?.name || '', password: '' });
	}, [visible, editingUser, form]);

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
				<Typography.Text strong>Quản lý user</Typography.Text>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingUser(undefined);
						setVisible(true);
					}}
				>
					Thêm user
				</Button>
			</div>
			<Table<QLCVNUser>
				rowKey='id'
				pagination={{ pageSize: 5, showSizeChanger: false }}
				locale={{ emptyText: <Empty description='Chưa có user' /> }}
				dataSource={users}
				columns={[
					{ title: 'Tên user', dataIndex: 'name', key: 'name' },
					{
						title: 'Trạng thái',
						key: 'isCurrent',
						render: (_, record) =>
							record.id === currentUserId ? <Tag color='success'>Đang đăng nhập</Tag> : <Tag>Mặc định</Tag>,
					},
					{
						title: 'Thao tác',
						key: 'actions',
						render: (_, record) => (
							<Space>
								<Button
									type='text'
									icon={<EditOutlined />}
									onClick={() => {
										setEditingUser(record);
										setVisible(true);
									}}
								/>
								<Popconfirm
									title='Bạn có chắc chắn muốn xóa user này?'
									onConfirm={() => onDelete(record)}
									okText='Xóa'
									cancelText='Hủy'
								>
									<Button type='text' danger icon={<DeleteOutlined />} />
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>

			<Modal
				visible={visible}
				title={editingUser ? 'Cập nhật user' : 'Thêm user'}
				onCancel={() => setVisible(false)}
				footer={null}
				destroyOnClose
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={(values) => {
						const password = values.password?.trim();
						if (editingUser) {
							onUpdate(editingUser.id, values.name.trim(), password || undefined);
						} else {
							onAdd(values.name.trim(), password || '');
						}
						setVisible(false);
					}}
				>
					<Form.Item
						name='name'
						label='Tên user'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên user' },
							{ max: 100, message: 'Tên user tối đa 100 ký tự' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='password'
						label='Mật khẩu'
						rules={editingUser ? [] : [{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
					>
						<Input.Password placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : 'Nhập mật khẩu'} />
					</Form.Item>
					<div style={{ textAlign: 'right' }}>
						<Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit'>
							{editingUser ? 'Lưu' : 'Thêm'}
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default UserManager;
