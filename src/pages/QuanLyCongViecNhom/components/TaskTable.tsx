import React from 'react';
import { Button, Empty, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { QLCVNTask, QLCVNUser, TaskPriority, TaskStatus } from '@/pages/QuanLyCongViecNhom/typing';

interface TaskTableProps {
	tasks: QLCVNTask[];
	users: QLCVNUser[];
	onEdit: (task: QLCVNTask) => void;
	onDelete: (taskId: string) => void;
}

const priorityMeta: Record<TaskPriority, { label: string; color: string }> = {
	THAP: { label: 'Thấp', color: 'default' },
	TRUNG_BINH: { label: 'Trung bình', color: 'processing' },
	CAO: { label: 'Cao', color: 'error' },
};

const statusMeta: Record<TaskStatus, { label: string; color: string }> = {
	CHUA_LAM: { label: 'Chưa làm', color: 'default' },
	DANG_LAM: { label: 'Đang làm', color: 'gold' },
	DA_XONG: { label: 'Đã xong', color: 'success' },
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, users, onEdit, onDelete }) => {
	const userNameById = users.reduce<Record<string, string>>((acc, user) => {
		acc[user.id] = user.name;
		return acc;
	}, {});

	return (
		<Table<QLCVNTask>
			rowKey='id'
			dataSource={tasks}
			locale={{ emptyText: <Empty description='Chưa có công việc nào' /> }}
			pagination={{ pageSize: 8, showSizeChanger: false }}
			columns={[
				{
					title: 'Tên công việc',
					dataIndex: 'title',
					key: 'title',
				},
				{
					title: 'Người được giao',
					dataIndex: 'assigneeId',
					key: 'assigneeId',
					render: (assigneeId: string) => userNameById[assigneeId] || 'Không xác định',
				},
				{
					title: 'Ưu tiên',
					dataIndex: 'priority',
					key: 'priority',
					render: (priority: TaskPriority) => (
						<Tag color={priorityMeta[priority].color}>{priorityMeta[priority].label}</Tag>
					),
				},
				{
					title: 'Deadline',
					dataIndex: 'deadline',
					key: 'deadline',
					render: (deadline: string) => deadline,
				},
				{
					title: 'Trạng thái',
					dataIndex: 'status',
					key: 'status',
					render: (status: TaskStatus) => <Tag color={statusMeta[status].color}>{statusMeta[status].label}</Tag>,
				},
				{
					title: 'Thao tác',
					key: 'actions',
					width: 120,
					render: (_, record) => (
						<Space>
							<Tooltip title='Sửa'>
								<Button type='text' icon={<EditOutlined />} onClick={() => onEdit(record)} />
							</Tooltip>
							<Popconfirm
								title='Bạn có chắc chắn muốn xóa công việc này?'
								onConfirm={() => onDelete(record.id)}
								okText='Xóa'
								cancelText='Hủy'
							>
								<Tooltip title='Xóa'>
									<Button type='text' danger icon={<DeleteOutlined />} />
								</Tooltip>
							</Popconfirm>
						</Space>
					),
				},
			]}
		/>
	);
};

export default TaskTable;
