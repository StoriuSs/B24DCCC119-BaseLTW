import React, { useEffect } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment, { Moment } from 'moment';
import { QLCVNTask, QLCVNUser, TaskPriority, TaskStatus } from '@/pages/QuanLyCongViecNhom/typing';

interface TaskFormValues {
	title: string;
	assigneeId: string;
	priority: TaskPriority;
	deadline: Moment;
	status: TaskStatus;
}

interface TaskFormProps {
	visible: boolean;
	users: QLCVNUser[];
	editingTask?: QLCVNTask;
	onCancel: () => void;
	onSubmit: (values: Omit<QLCVNTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, users, editingTask, onCancel, onSubmit }) => {
	const [form] = Form.useForm<TaskFormValues>();

	useEffect(() => {
		if (!visible) return;
		if (!editingTask) {
			form.setFieldsValue({
				title: '',
				assigneeId: undefined,
				priority: 'TRUNG_BINH',
				deadline: undefined,
				status: 'CHUA_LAM',
			});
			return;
		}
		form.setFieldsValue({
			title: editingTask.title,
			assigneeId: editingTask.assigneeId,
			priority: editingTask.priority,
			deadline: moment(editingTask.deadline, 'YYYY-MM-DD'),
			status: editingTask.status,
		});
	}, [visible, editingTask, form]);

	return (
		<Modal
			visible={visible}
			title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
			onCancel={onCancel}
			footer={null}
			destroyOnClose
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={(values) => {
					onSubmit({
						title: values.title.trim(),
						assigneeId: values.assigneeId,
						priority: values.priority,
						deadline: values.deadline.format('YYYY-MM-DD'),
						status: values.status,
					});
				}}
			>
				<Form.Item
					name='title'
					label='Tên công việc'
					rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
				>
					<Input maxLength={200} />
				</Form.Item>
				<Form.Item
					name='assigneeId'
					label='Người được giao'
					rules={[{ required: true, message: 'Vui lòng chọn người được giao' }]}
				>
					<Select
						showSearch
						placeholder='Chọn người được giao'
						optionFilterProp='children'
						filterOption={(input, option) =>
							String(option?.children || '')
								.toLowerCase()
								.includes(input.toLowerCase())
						}
					>
						{users.map((user) => (
							<Select.Option key={user.id} value={user.id}>
								{user.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='priority'
					label='Mức độ ưu tiên'
					rules={[{ required: true, message: 'Vui lòng chọn mức ưu tiên' }]}
				>
					<Select>
						<Select.Option value='THAP'>Thấp</Select.Option>
						<Select.Option value='TRUNG_BINH'>Trung bình</Select.Option>
						<Select.Option value='CAO'>Cao</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name='deadline' label='Deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>
				<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
					<Select>
						<Select.Option value='CHUA_LAM'>Chưa làm</Select.Option>
						<Select.Option value='DANG_LAM'>Đang làm</Select.Option>
						<Select.Option value='DA_XONG'>Đã xong</Select.Option>
					</Select>
				</Form.Item>
				<div style={{ textAlign: 'right' }}>
					<Button onClick={onCancel} style={{ marginRight: 8 }}>
						Hủy
					</Button>
					<Button htmlType='submit' type='primary'>
						{editingTask ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default TaskForm;
