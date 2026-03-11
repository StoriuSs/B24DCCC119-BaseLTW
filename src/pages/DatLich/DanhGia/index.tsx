import { type IColumn } from '@/components/Table/typing';
import { Button, Card, Form, Input, Modal, Rate, Select, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Text, Paragraph } = Typography;

const DanhGiaPage = () => {
	const { danhSach, loading, lichHenHoanThanh, nhanViens, dichVus, getData, taoDanhGia, phanHoi } =
		useModel('datlich.danhgia');
	const [visibleForm, setVisibleForm] = useState(false);
	const [phanHoiId, setPhanHoiId] = useState('');
	const [form] = Form.useForm();
	const [formPhanHoi] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<DatLich.DanhGia>[] = [
		{
			title: 'Lịch hẹn',
			width: 200,
			render: (r: DatLich.DanhGia) => {
				const found = lichHenHoanThanh.find((item) => item._id === r.lichHenId);
				return found ? `${found.tenKhachHang} - ${found.ngayHen}` : r.lichHenId;
			},
		},
		{
			title: 'Nhân viên',
			width: 180,
			render: (r: DatLich.DanhGia) => nhanViens.find((nv) => nv._id === r.nhanVienId)?.tenNhanVien ?? '',
		},
		{
			title: 'Dịch vụ',
			width: 160,
			render: (r: DatLich.DanhGia) => dichVus.find((dv) => dv._id === r.dichVuId)?.tenDichVu ?? '',
		},
		{
			title: 'Điểm',
			width: 160,
			render: (r: DatLich.DanhGia) => <Rate disabled value={r.diem} />,
		},
		{ title: 'Nội dung', dataIndex: 'noiDung', width: 260 },
		{
			title: 'Phản hồi nhân viên',
			width: 240,
			render: (r: DatLich.DanhGia) =>
				r.phanHoiNhanVien ? (
					<Paragraph style={{ marginBottom: 0 }}>{r.phanHoiNhanVien}</Paragraph>
				) : (
					<Button
						size='small'
						type='link'
						onClick={() => {
							setPhanHoiId(r._id);
							formPhanHoi.resetFields();
						}}
					>
						Phản hồi
					</Button>
				),
		},
	];

	const nhanVienDiemTongHop = nhanViens.map((nv) => {
		const dsNv = danhSach.filter((item) => item.nhanVienId === nv._id);
		const avg = dsNv.length ? dsNv.reduce((s, item) => s + item.diem, 0) / dsNv.length : 0;
		return { ...nv, diemTrungBinh: avg, soDanhGia: dsNv.length };
	});

	return (
		<Space direction='vertical' style={{ width: '100%' }} size={16}>
			<Card title='Điểm trung bình nhân viên'>
				<Space wrap>
					{nhanVienDiemTongHop.map((nv) => (
						<Card key={nv._id} size='small' style={{ minWidth: 200 }}>
							<Text strong>{nv.tenNhanVien}</Text>
							<br />
							<Rate disabled allowHalf value={nv.diemTrungBinh} />
							<br />
							<Text type='secondary'>
								{nv.diemTrungBinh.toFixed(1)} / 5 ({nv.soDanhGia} danh gia)
							</Text>
						</Card>
					))}
				</Space>
			</Card>

			<Card
				title='Danh sách đánh giá'
				extra={
					lichHenHoanThanh.length > 0 && (
						<Button
							type='primary'
							onClick={() => {
								form.resetFields();
								setVisibleForm(true);
							}}
						>
							Viết đánh giá
						</Button>
					)
				}
			>
				<Table
					rowKey='_id'
					loading={loading}
					dataSource={danhSach}
					columns={columns}
					pagination={{ pageSize: 10 }}
					scroll={{ x: 1200 }}
				/>
			</Card>

			<Modal
				title='Đánh giá dịch vụ'
				visible={visibleForm}
				footer={false}
				onCancel={() => setVisibleForm(false)}
				destroyOnClose
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={(values) => {
						const lh = lichHenHoanThanh.find((item) => item._id === values.lichHenId);
						if (!lh) return;
						const ok = taoDanhGia({
							lichHenId: lh._id,
							nhanVienId: lh.nhanVienId,
							dichVuId: lh.dichVuId,
							diem: values.diem,
							noiDung: values.noiDung,
						});
						if (ok) setVisibleForm(false);
					}}
				>
					<Form.Item
						name='lichHenId'
						label='Chọn lịch hẹn cần đánh giá'
						rules={[{ required: true, message: 'Chọn lịch hẹn' }]}
					>
						<Select
							options={lichHenHoanThanh.map((lh) => ({
								label: `${lh.tenKhachHang} - ${lh.ngayHen} (${
									nhanViens.find((nv) => nv._id === lh.nhanVienId)?.tenNhanVien ?? ''
								})`,
								value: lh._id,
							}))}
						/>
					</Form.Item>
					<Form.Item name='diem' label='Điểm đánh giá' rules={[{ required: true, message: 'Chọn điểm' }]}>
						<Rate />
					</Form.Item>
					<Form.Item name='noiDung' label='Nội dung đánh giá' rules={[{ required: true, message: 'Nhập nội dung' }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Space>
						<Button type='primary' htmlType='submit'>
							Gửi đánh giá
						</Button>
						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</Space>
				</Form>
			</Modal>

			<Modal
				title='Phản hồi đánh giá'
				visible={!!phanHoiId}
				footer={false}
				onCancel={() => setPhanHoiId('')}
				destroyOnClose
			>
				<Form
					form={formPhanHoi}
					layout='vertical'
					onFinish={(values) => {
						phanHoi(phanHoiId, values.phanHoi);
						setPhanHoiId('');
					}}
				>
					<Form.Item name='phanHoi' label='Nội dung phản hồi' rules={[{ required: true, message: 'Nhập phản hồi' }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Space>
						<Button type='primary' htmlType='submit'>
							Gửi phản hồi
						</Button>
						<Button onClick={() => setPhanHoiId('')}>Huy</Button>
					</Space>
				</Form>
			</Modal>
		</Space>
	);
};

export default DanhGiaPage;
