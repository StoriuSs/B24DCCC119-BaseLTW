import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface ModalDuyetProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (lyDo?: string) => void;
	type: 'Approved' | 'Rejected';
	count: number;
	loading?: boolean;
}

const ModalDuyet: React.FC<ModalDuyetProps> = ({ visible, onCancel, onOk, type, count, loading }) => {
	const [form] = Form.useForm();

	const handleSubmit = async () => {
		if (type === 'Rejected') {
			const values = await form.validateFields();
			onOk(values.lyDo);
		} else {
			onOk();
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title={type === 'Approved' ? 'Xác nhận duyệt' : 'Từ chối đơn đăng ký'}
			visible={visible}
			onCancel={handleCancel}
			footer={[
				<Button key='cancel' onClick={handleCancel}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' loading={loading} onClick={handleSubmit}>
					{type === 'Approved' ? 'Duyệt' : 'Từ chối'}
				</Button>,
			]}
		>
			{type === 'Approved' ? (
				<p>Xác nhận duyệt {count} đơn đăng ký?</p>
			) : (
				<Form form={form} layout='vertical'>
					<p>Từ chối {count} đơn đăng ký</p>
					<Form.Item
						name='lyDo'
						label='Lý do từ chối'
						rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
					>
						<Input.TextArea placeholder='Nhập lý do từ chối' rows={4} />
					</Form.Item>
				</Form>
			)}
		</Modal>
	);
};

export default ModalDuyet;
