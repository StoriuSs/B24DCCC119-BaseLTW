import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message } from 'antd';
import { useModel } from 'umi';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';

interface ModalChuyenCLBProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (cauLacBoIdMoi: string) => void;
	count: number;
	currentCauLacBoId?: string;
	loading?: boolean;
}

const ModalChuyenCLB: React.FC<ModalChuyenCLBProps> = ({
	visible,
	onCancel,
	onOk,
	count,
	currentCauLacBoId,
	loading,
}) => {
	const [form] = Form.useForm();
	const { getAllModel: getAllCauLacBo } = useModel('quanlycaulacbo.cauLacBo');
	const [cauLacBoData, setCauLacBoData] = useState<CauLacBo[]>([]);

	useEffect(() => {
		const fetchCauLacBo = async () => {
			try {
				const data = await getAllCauLacBo(false, undefined, undefined, undefined, 'many', false);
				setCauLacBoData(data || []);
			} catch (error) {
				message.error('Lỗi tải danh sách câu lạc bộ');
			}
		};

		if (visible) fetchCauLacBo();
	}, [getAllCauLacBo, visible]);

	const handleSubmit = async () => {
		const values = await form.validateFields();
		onOk(values.cauLacBoIdMoi);
		form.resetFields();
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title='Chuyển câu lạc bộ'
			visible={visible}
			onCancel={handleCancel}
			footer={[
				<Button key='cancel' onClick={handleCancel}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' loading={loading} onClick={handleSubmit}>
					Chuyển
				</Button>,
			]}
		>
			<Form form={form} layout='vertical'>
				<p>Chuyển {count} thành viên sang CLB khác</p>
				<Form.Item
					name='cauLacBoIdMoi'
					label='Chọn câu lạc bộ'
					rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}
				>
					<Select placeholder='Chọn CLB đích'>
						{cauLacBoData.map((clb) => (
							<Select.Option key={clb.id} value={clb.id} disabled={clb.id === currentCauLacBoId}>
								{clb.tenCLB}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalChuyenCLB;
