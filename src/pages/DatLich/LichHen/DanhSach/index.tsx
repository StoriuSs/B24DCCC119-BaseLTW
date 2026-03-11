import { type IColumn } from '@/components/Table/typing';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const tagColor: Record<DatLich.TrangThaiLichHen, string> = {
	CHO_DUYET: 'gold',
	XAC_NHAN: 'blue',
	HOAN_THANH: 'green',
	HUY: 'red',
};

const tagLabel: Record<DatLich.TrangThaiLichHen, string> = {
	CHO_DUYET: 'Chờ duyệt',
	XAC_NHAN: 'Xác nhận',
	HOAN_THANH: 'Hoàn thành',
	HUY: 'Huỷ',
};

const DanhSachLichHenPage = () => {
	const { danhSach, loading, nhanViens, dichVus, getData, remove } = useModel('datlich.lichhen');

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<DatLich.LichHen>[] = [
		{ title: 'Mã lịch hẹn', dataIndex: 'maLichHen', width: 130 },
		{ title: 'Khách hàng', dataIndex: 'tenKhachHang', width: 180 },
		{ title: 'Số điện thoại', dataIndex: 'soDienThoai', width: 140 },
		{ title: 'Ngày hẹn', dataIndex: 'ngayHen', width: 120 },
		{
			title: 'Khung giờ',
			width: 140,
			render: (r: DatLich.LichHen) => `${r.gioBatDau} - ${r.gioKetThuc}`,
		},
		{
			title: 'Nhân viên',
			width: 180,
			render: (r: DatLich.LichHen) => nhanViens.find((nv) => nv._id === r.nhanVienId)?.tenNhanVien ?? r.nhanVienId,
		},
		{
			title: 'Dịch vụ',
			width: 160,
			render: (r: DatLich.LichHen) => dichVus.find((dv) => dv._id === r.dichVuId)?.tenDichVu ?? r.dichVuId,
		},
		{
			title: 'Tổng tiền',
			width: 130,
			render: (r: DatLich.LichHen) => `${new Intl.NumberFormat('vi-VN').format(r.tongTien)} VND`,
		},
		{
			title: 'Trạng thái',
			width: 140,
			render: (r: DatLich.LichHen) => <Tag color={tagColor[r.trangThai]}>{tagLabel[r.trangThai]}</Tag>,
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			render: (r: DatLich.LichHen) => (
				<Tooltip title='Xóa'>
					<Popconfirm title='Bạn chắc chắn muốn xóa?' onConfirm={() => remove(r._id)}>
						<Button danger type='link' size='small'>
							Xóa
						</Button>
					</Popconfirm>
				</Tooltip>
			),
		},
	];

	return (
		<Card
			title='Danh sách lịch hẹn'
			extra={
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => history.push('/dat-lich-dich-vu/lich-hen/dat-lich')}
				>
					Đặt lịch mới
				</Button>
			}
		>
			<Space style={{ marginBottom: 16 }}>
				{(Object.keys(tagLabel) as DatLich.TrangThaiLichHen[]).map((s) => (
					<Tag key={s} color={tagColor[s]}>
						{tagLabel[s]}: {danhSach.filter((item) => item.trangThai === s).length}
					</Tag>
				))}
			</Space>
			<Table
				rowKey='_id'
				loading={loading}
				dataSource={danhSach}
				columns={columns}
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1400 }}
			/>
		</Card>
	);
};

export default DanhSachLichHenPage;
