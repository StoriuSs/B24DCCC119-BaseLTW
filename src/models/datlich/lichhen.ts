import { message } from 'antd';
import { useState } from 'react';
import { getDichVus } from '@/services/DatLich/dichvu';
import { createLichHen, deleteLichHen, getLichHens, updateTrangThaiLichHen } from '@/services/DatLich/lichhen';
import { getNhanViens } from '@/services/DatLich/nhanvien';

export default () => {
	const [danhSach, setDanhSach] = useState<DatLich.LichHen[]>([]);
	const [loading, setLoading] = useState(false);
	const [nhanViens, setNhanViens] = useState<DatLich.NhanVien[]>([]);
	const [dichVus, setDichVus] = useState<DatLich.DichVu[]>([]);

	const getData = () => {
		setLoading(true);
		try {
			setDanhSach(getLichHens());
			setNhanViens(getNhanViens().filter((item) => item.trangThai === 'ACTIVE'));
			setDichVus(getDichVus().filter((item) => item.trangThai === 'ACTIVE'));
		} finally {
			setLoading(false);
		}
	};

	const datLich = (payload: {
		tenKhachHang: string;
		soDienThoai: string;
		ngayHen: string;
		gioBatDau: string;
		nhanVienId: string;
		dichVuId: string;
		ghiChu?: string;
	}) => {
		try {
			createLichHen(payload);
			message.success('Đặt lịch thành công');
			getData();
			return true;
		} catch (error: any) {
			message.error(error?.message || 'Đặt lịch thất bại');
			return false;
		}
	};

	const capNhatTrangThai = (id: string, trangThai: DatLich.TrangThaiLichHen) => {
		updateTrangThaiLichHen(id, trangThai);
		message.success('Cập nhật trạng thái thành công');
		getData();
	};

	const remove = (id: string) => {
		deleteLichHen(id);
		message.success('Xóa lịch hẹn thành công');
		getData();
	};

	return {
		danhSach,
		loading,
		nhanViens,
		dichVus,
		getData,
		datLich,
		capNhatTrangThai,
		remove,
	};
};
