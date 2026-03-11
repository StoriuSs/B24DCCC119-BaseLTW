import { Button, Form, Input, InputNumber, Select, Space } from 'antd';

type Props = {
	record?: DatLich.DichVu;
	isEdit: boolean;
	onCancel: () => void;
	onSubmit: (payload: Omit<DatLich.DichVu, '_id'>) => void;
};

const FormDichVu = ({ record, isEdit, onCancel, onSubmit }: Props) => {
	const [form] = Form.useForm();

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{
				maDichVu: record?.maDichVu,
				tenDichVu: record?.tenDichVu,
				gia: record?.gia,
				thoiLuongPhut: record?.thoiLuongPhut,
				moTa: record?.moTa,
				trangThai: record?.trangThai || 'ACTIVE',
			}}
			onFinish={(values) => {
				onSubmit({
					maDichVu: values.maDichVu,
					tenDichVu: values.tenDichVu,
					gia: values.gia,
					thoiLuongPhut: values.thoiLuongPhut,
					moTa: values.moTa,
					trangThai: values.trangThai,
				});
			}}
		>
			<Form.Item name='maDichVu' label='Mã dịch vụ' rules={[{ required: true, message: 'Nhập mã dịch vụ' }]}>
				<Input disabled={isEdit} />
			</Form.Item>
			<Form.Item name='tenDichVu' label='Tên dịch vụ' rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}>
				<Input />
			</Form.Item>
			<Form.Item name='gia' label='Giá' rules={[{ required: true, message: 'Nhập giá dịch vụ' }]}>
				<InputNumber min={0} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				name='thoiLuongPhut'
				label='Thời lượng (phút)'
				rules={[{ required: true, message: 'Nhập thời lượng' }]}
			>
				<InputNumber min={5} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name='moTa' label='Mô tả'>
				<Input.TextArea rows={3} />
			</Form.Item>
			<Form.Item name='trangThai' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
				<Select
					options={[
						{ label: 'Đang hoạt động', value: 'ACTIVE' },
						{ label: 'Ngưng hoạt động', value: 'INACTIVE' },
					]}
				/>
			</Form.Item>

			<Space>
				<Button type='primary' htmlType='submit'>
					{isEdit ? 'Lưu' : 'Thêm mới'}
				</Button>
				<Button onClick={onCancel}>Huỷ</Button>
			</Space>
		</Form>
	);
};

export default FormDichVu;
