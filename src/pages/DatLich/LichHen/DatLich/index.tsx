import MyDatePicker from '@/components/MyDatePicker';
import { calcEndTime, getAvailableNhanViens } from '@/services/DatLich/lichhen';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select, Space, TimePicker, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const { Text } = Typography;

const DatLichPage = () => {
	const { dichVus, getData, datLich } = useModel('datlich.lichhen');
	const [gioKetThuc, setGioKetThuc] = useState('');
	const [tongTien, setTongTien] = useState(0);
	const [availableNhanViens, setAvailableNhanViens] = useState<DatLich.NhanVien[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

	const refreshAvailableNhanViens = (overrides?: {
		dichVuId?: string;
		ngayHen?: string;
		gioBatDau?: moment.Moment;
	}) => {
		const dichVuId = overrides?.dichVuId ?? form.getFieldValue('dichVuId');
		const ngayHen = overrides?.ngayHen ?? form.getFieldValue('ngayHen');
		const gioBatDauMoment: moment.Moment | undefined = overrides?.gioBatDau ?? form.getFieldValue('gioBatDau');
		if (dichVuId && ngayHen && gioBatDauMoment) {
			setAvailableNhanViens(getAvailableNhanViens(ngayHen, gioBatDauMoment.format('HH:mm'), dichVuId));
		} else {
			setAvailableNhanViens([]);
		}
		form.setFieldsValue({ nhanVienId: undefined });
	};

	const handleDichVuChange = (dichVuId: string) => {
		const dichVu = dichVus.find((item) => item._id === dichVuId);
		if (!dichVu) {
			setTongTien(0);
			setGioKetThuc('');
		} else {
			setTongTien(dichVu.gia);
			const gioBatDau: moment.Moment | undefined = form.getFieldValue('gioBatDau');
			if (gioBatDau) setGioKetThuc(calcEndTime(gioBatDau.format('HH:mm'), dichVu.thoiLuongPhut));
		}
		refreshAvailableNhanViens({ dichVuId });
	};

	const handleNgayChange = (ngayHen: string | null) => {
		refreshAvailableNhanViens({ ngayHen: ngayHen ?? undefined });
	};

	const handleGioChange = (time: moment.Moment | null) => {
		if (!time) {
			setGioKetThuc('');
			refreshAvailableNhanViens({ gioBatDau: undefined });
			return;
		}
		const dichVuId = form.getFieldValue('dichVuId');
		const dichVu = dichVus.find((item) => item._id === dichVuId);
		if (dichVu) setGioKetThuc(calcEndTime(time.format('HH:mm'), dichVu.thoiLuongPhut));
		refreshAvailableNhanViens({ gioBatDau: time });
	};

	const onFinish = (values: any) => {
		const ok = datLich({
			tenKhachHang: values.tenKhachHang,
			soDienThoai: values.soDienThoai,
			ngayHen: values.ngayHen,
			gioBatDau: values.gioBatDau.format('HH:mm'),
			nhanVienId: values.nhanVienId,
			dichVuId: values.dichVuId,
			ghiChu: values.ghiChu,
		});
		if (ok) {
			form.resetFields();
			setGioKetThuc('');
			setTongTien(0);
			history.push('/dat-lich-dich-vu/lich-hen/danh-sach');
		}
	};

	return (
		<Card
			title={
				<Space>
					<Button
						type='text'
						icon={<ArrowLeftOutlined />}
						onClick={() => history.push('/dat-lich-dich-vu/lich-hen/danh-sach')}
					/>
					Đặt lịch dịch vụ
				</Space>
			}
		>
			<Form form={form} layout='vertical' onFinish={onFinish} style={{ maxWidth: 600 }}>
				<Form.Item
					name='tenKhachHang'
					label='Tên khách hàng'
					rules={[{ required: true, message: 'Nhập tên khách hàng' }]}
				>
					<Input placeholder='Nguyễn Văn A' />
				</Form.Item>

				<Form.Item
					name='soDienThoai'
					label='Số điện thoại'
					rules={[
						{ required: true, message: 'Nhập số điện thoại' },
						{ pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' },
					]}
				>
					<Input placeholder='0912345678' />
				</Form.Item>

				<Form.Item name='dichVuId' label='Dịch vụ' rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
					<Select
						placeholder='Chọn dịch vụ'
						options={dichVus.map((dv) => ({
							label: `${dv.tenDichVu} - ${new Intl.NumberFormat('vi-VN').format(dv.gia)} VND (${
								dv.thoiLuongPhut
							} phút)`,
							value: dv._id,
						}))}
						onChange={handleDichVuChange}
					/>
				</Form.Item>

				<Form.Item name='ngayHen' label='Ngày hẹn' rules={[{ required: true, message: 'Chọn ngày hẹn' }]}>
					<MyDatePicker
						saveFormat='YYYY-MM-DD'
						disabledDate={(cur) => moment(cur).isBefore(moment(), 'day')}
						onChange={handleNgayChange}
					/>
				</Form.Item>

				<Form.Item name='gioBatDau' label='Giờ bắt đầu' rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}>
					<TimePicker format='HH:mm' onChange={handleGioChange} minuteStep={15} />
				</Form.Item>

				{gioKetThuc && (
					<Form.Item label='Dự kiến hoàn thành'>
						<Text strong>{gioKetThuc}</Text>
					</Form.Item>
				)}

				{tongTien > 0 && (
					<Form.Item label='Tổng tiền'>
						<Text strong type='danger'>
							{new Intl.NumberFormat('vi-VN').format(tongTien)} VND
						</Text>
					</Form.Item>
				)}

				<Form.Item
					name='nhanVienId'
					label='Nhân viên phụ trách'
					rules={[{ required: true, message: 'Chọn nhân viên' }]}
					help={
						availableNhanViens.length === 0 &&
						form.getFieldValue('dichVuId') &&
						form.getFieldValue('ngayHen') &&
						form.getFieldValue('gioBatDau')
							? 'Không có nhân viên khả dụng trong khung giờ này'
							: undefined
					}
				>
					<Select
						placeholder={
							form.getFieldValue('dichVuId') && form.getFieldValue('ngayHen') && form.getFieldValue('gioBatDau')
								? 'Chọn nhân viên'
								: 'Vui lòng chọn dịch vụ, ngày hẹn và giờ bắt đầu trước'
						}
						disabled={
							!form.getFieldValue('dichVuId') || !form.getFieldValue('ngayHen') || !form.getFieldValue('gioBatDau')
						}
						options={availableNhanViens.map((nv) => ({ label: nv.tenNhanVien, value: nv._id }))}
					/>
				</Form.Item>

				<Form.Item name='ghiChu' label='Ghi chú'>
					<Input.TextArea rows={3} placeholder='Ghi chú thêm (nếu có)' />
				</Form.Item>

				<Space>
					<Button type='primary' htmlType='submit'>
						Đặt lịch
					</Button>
					<Button onClick={() => history.push('/dat-lich-dich-vu/lich-hen/danh-sach')}>Huỷ</Button>
				</Space>
			</Form>
		</Card>
	);
};

export default DatLichPage;
