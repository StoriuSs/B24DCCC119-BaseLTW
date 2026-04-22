import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { Room, RoomInput, RoomType } from '@/services/QuanLyPhongHoc/typing';

interface RoomFormProps {
	visible: boolean;
	editingRoom?: Room;
	roomTypeOptions: { value: RoomType; label: string }[];
	responsibleTeachers: string[];
	onCancel: () => void;
	onSubmit: (payload: RoomInput) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({
	visible,
	editingRoom,
	roomTypeOptions,
	responsibleTeachers,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm<RoomInput>();

	useEffect(() => {
		if (!visible) return;
		if (editingRoom) {
			form.setFieldsValue({
				maPhong: editingRoom.maPhong,
				tenPhong: editingRoom.tenPhong,
				soChoNgoi: editingRoom.soChoNgoi,
				loaiPhong: editingRoom.loaiPhong,
				nguoiPhuTrach: editingRoom.nguoiPhuTrach,
			});
			return;
		}

		form.setFieldsValue({
			maPhong: '',
			tenPhong: '',
			soChoNgoi: 30,
			loaiPhong: 'LY_THUYET',
			nguoiPhuTrach: undefined,
		});
	}, [visible, editingRoom, form]);

	return (
		<Modal
			visible={visible}
			title={editingRoom ? 'Chỉnh sửa phòng học' : 'Thêm phòng học'}
			onCancel={onCancel}
			footer={null}
			destroyOnClose
		>
			<Form<RoomInput>
				layout='vertical'
				form={form}
				onFinish={(values) => {
					onSubmit({
						maPhong: values.maPhong.trim(),
						tenPhong: values.tenPhong.trim(),
						soChoNgoi: values.soChoNgoi,
						loaiPhong: values.loaiPhong,
						nguoiPhuTrach: values.nguoiPhuTrach,
					});
				}}
			>
				<Form.Item
					label='Mã phòng'
					name='maPhong'
					rules={[
						{ required: true, message: 'Vui lòng nhập mã phòng.' },
						{ max: 10, message: 'Mã phòng tối đa 10 ký tự.' },
					]}
				>
					<Input maxLength={10} />
				</Form.Item>

				<Form.Item
					label='Tên phòng'
					name='tenPhong'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên phòng.' },
						{ max: 50, message: 'Tên phòng tối đa 50 ký tự.' },
					]}
				>
					<Input maxLength={50} />
				</Form.Item>

				<Form.Item
					label='Người phụ trách'
					name='nguoiPhuTrach'
					rules={[{ required: true, message: 'Vui lòng chọn người phụ trách.' }]}
				>
					<Select placeholder='Chọn người phụ trách'>
						{responsibleTeachers.map((teacher) => (
							<Select.Option key={teacher} value={teacher}>
								{teacher}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label='Số chỗ ngồi'
					name='soChoNgoi'
					validateTrigger={['onBlur', 'onSubmit']}
					rules={[
						{ required: true, message: 'Vui lòng nhập số chỗ ngồi.' },
						{
							validator: (_, value) => {
								if (typeof value !== 'number') return Promise.reject(new Error('Số chỗ ngồi phải là số (10 - 200).'));
								if (value < 10 || value > 200)
									return Promise.reject(new Error('Số chỗ ngồi phải nằm trong khoảng từ 10 đến 200.'));
								return Promise.resolve();
							},
						},
					]}
				>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Loại phòng'
					name='loaiPhong'
					rules={[{ required: true, message: 'Vui lòng chọn loại phòng.' }]}
				>
					<Select>
						{roomTypeOptions.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<div style={{ textAlign: 'right' }}>
					<Button style={{ marginRight: 8 }} onClick={onCancel}>
						Hủy
					</Button>
					<Button type='primary' htmlType='submit'>
						{editingRoom ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default RoomForm;
