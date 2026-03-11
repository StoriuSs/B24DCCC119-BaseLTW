import { Button, Checkbox, Form, Input, InputNumber, Select, Space, TimePicker } from 'antd';
import moment from 'moment';

type Props = {
	record?: DatLich.NhanVien;
	isEdit: boolean;
	onCancel: () => void;
	onSubmit: (payload: Omit<DatLich.NhanVien, '_id'>) => void;
};

const dayOptions = [
	{ label: 'Thứ 2', value: 1 },
	{ label: 'Thứ 3', value: 2 },
	{ label: 'Thứ 4', value: 3 },
	{ label: 'Thứ 5', value: 4 },
	{ label: 'Thứ 6', value: 5 },
	{ label: 'Thứ 7', value: 6 },
	{ label: 'Chủ nhật', value: 7 },
];

const FormNhanVien = ({ record, isEdit, onCancel, onSubmit }: Props) => {
	const [form] = Form.useForm();

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{
				maNhanVien: record?.maNhanVien,
				tenNhanVien: record?.tenNhanVien,
				soKhachToiDaMoiNgay: record?.soKhachToiDaMoiNgay,
				thuLamViec: record?.lichLamViec?.map((item) => item.thu),
				gioBatDau: record?.lichLamViec?.[0]?.gioBatDau
					? moment(record?.lichLamViec?.[0]?.gioBatDau, 'HH:mm')
					: moment('09:00', 'HH:mm'),
				gioKetThuc: record?.lichLamViec?.[0]?.gioKetThuc
					? moment(record?.lichLamViec?.[0]?.gioKetThuc, 'HH:mm')
					: moment('17:00', 'HH:mm'),
				trangThai: record?.trangThai || 'ACTIVE',
			}}
			onFinish={(values) => {
				const lichLamViec: DatLich.LichLamViec[] = (values.thuLamViec || []).map((thu: number) => ({
					thu,
					gioBatDau: values.gioBatDau.format('HH:mm'),
					gioKetThuc: values.gioKetThuc.format('HH:mm'),
				}));

				onSubmit({
					maNhanVien: values.maNhanVien,
					tenNhanVien: values.tenNhanVien,
					soKhachToiDaMoiNgay: values.soKhachToiDaMoiNgay,
					lichLamViec,
					trangThai: values.trangThai,
				});
			}}
		>
			<Form.Item name='maNhanVien' label='Mã nhân viên' rules={[{ required: true, message: 'Nhập mã nhân viên' }]}>
				<Input disabled={isEdit} />
			</Form.Item>

			<Form.Item name='tenNhanVien' label='Tên nhân viên' rules={[{ required: true, message: 'Nhập tên nhân viên' }]}>
				<Input />
			</Form.Item>

			<Form.Item
				name='soKhachToiDaMoiNgay'
				label='Số khách tối đa mỗi ngày'
				rules={[{ required: true, message: 'Nhập giới hạn khách' }]}
			>
				<InputNumber min={1} max={50} style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item name='thuLamViec' label='Ngày làm việc' rules={[{ required: true, message: 'Chọn ngày làm việc' }]}>
				<Checkbox.Group options={dayOptions} />
			</Form.Item>

			<Space size={16} style={{ width: '100%' }}>
				<Form.Item name='gioBatDau' label='Giờ bắt đầu' rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}>
					<TimePicker format='HH:mm' />
				</Form.Item>

				<Form.Item name='gioKetThuc' label='Giờ kết thúc' rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}>
					<TimePicker format='HH:mm' />
				</Form.Item>
			</Space>

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

export default FormNhanVien;
