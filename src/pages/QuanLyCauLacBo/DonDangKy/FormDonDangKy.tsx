import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useModel } from 'umi';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';

const FormDonDangKy: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting, isView, setIsView } =
		useModel('quanlycaulacbo.donDangKy');
	const { getAllModel: getAllCauLacBo } = useModel('quanlycaulacbo.cauLacBo');
	const [form] = Form.useForm();
	const [cauLacBoData, setCauLacBoData] = React.useState<CauLacBo[]>([]);

	useEffect(() => {
		const fetchCauLacBo = async () => {
			try {
				const data = await getAllCauLacBo(false, undefined, undefined, undefined, 'many', false);
				setCauLacBoData(data || []);
			} catch (error) {
				message.error('Lỗi tải danh sách câu lạc bộ');
			}
		};

		fetchCauLacBo();
	}, [getAllCauLacBo]);

	useEffect(() => {
		if ((edit || isView) && record) {
			form.setFieldsValue({
				hoTen: record.hoTen,
				email: record.email,
				sdt: record.sdt,
				gioiTinh: record.gioiTinh,
				diaChi: record.diaChi,
				soTruong: record.soTruong,
				cauLacBoId: record.cauLacBoId,
				lyDoDangKy: record.lyDoDangKy,
				trangThai: record.trangThai,
				ghiChu: record.ghiChu,
			});
		} else {
			form.resetFields();
		}
	}, [edit, isView, record, form]);

	const handleSubmit = async (values: any) => {
		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
		setVisibleForm(false);
		setIsView?.(false);
	};

	const handleCancel = () => {
		setVisibleForm(false);
		setIsView?.(false);
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='hoTen' label='Họ tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
				<Input placeholder='VD: Phạm Minh Huy' disabled={isView} />
			</Form.Item>

			<Form.Item name='email' label='Email' rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
				<Input placeholder='VD: huy.pham@example.com' disabled={isView} />
			</Form.Item>

			<Form.Item name='sdt' label='Số điện thoại' rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
				<Input placeholder='VD: 0901234567' disabled={isView} />
			</Form.Item>

			<Form.Item name='gioiTinh' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
				<Select disabled={isView}>
					<Select.Option value='Nam'>Nam</Select.Option>
					<Select.Option value='Nữ'>Nữ</Select.Option>
					<Select.Option value='Khác'>Khác</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item name='diaChi' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
				<Input placeholder='VD: 123 Đường A, Quận 1, TP.HCM' disabled={isView} />
			</Form.Item>

			<Form.Item name='soTruong' label='Sở trường' rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
				<Input placeholder='VD: PTIT' disabled={isView} />
			</Form.Item>

			<Form.Item name='cauLacBoId' label='Câu lạc bộ' rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
				<Select placeholder='Chọn CLB' disabled={isView}>
					{cauLacBoData.map((clb) => (
						<Select.Option key={clb.id} value={clb.id}>
							{clb.tenCLB}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				name='lyDoDangKy'
				label='Lý do đăng ký'
				rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
			>
				<Input.TextArea placeholder='Nhập lý do đăng ký' rows={3} disabled={isView} />
			</Form.Item>

			{(edit || isView) && (
				<>
					<Form.Item name='trangThai' label='Trạng thái'>
						<Select disabled>
							<Select.Option value='Pending'>Pending</Select.Option>
							<Select.Option value='Approved'>Approved</Select.Option>
							<Select.Option value='Rejected'>Rejected</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item name='ghiChu' label='Ghi chú (lý do từ chối)'>
						<Input.TextArea placeholder='Ghi chú' rows={2} disabled={isView} />
					</Form.Item>
				</>
			)}

			{!isView && (
				<div style={{ textAlign: 'right' }}>
					<Button onClick={handleCancel} style={{ marginRight: 8 }}>
						Hủy
					</Button>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{edit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</div>
			)}

			{isView && (
				<div style={{ textAlign: 'right' }}>
					<Button type='primary' onClick={handleCancel}>
						Đóng
					</Button>
				</div>
			)}
		</Form>
	);
};

export default FormDonDangKy;
