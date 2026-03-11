import { message } from 'antd';
import { useState } from 'react';
import { createDanhGia, getDanhGias, updatePhanHoiDanhGia } from '@/services/DatLich/danhgia';
import { getDichVus } from '@/services/DatLich/dichvu';
import { getLichHens } from '@/services/DatLich/lichhen';
import { getNhanViens } from '@/services/DatLich/nhanvien';

export default () => {
	const [danhSach, setDanhSach] = useState<DatLich.DanhGia[]>([]);
	const [loading, setLoading] = useState(false);
	const [lichHenHoanThanh, setLichHenHoanThanh] = useState<DatLich.LichHen[]>([]);
	const [nhanViens, setNhanViens] = useState<DatLich.NhanVien[]>([]);
	const [dichVus, setDichVus] = useState<DatLich.DichVu[]>([]);

	const getData = () => {
		setLoading(true);
		try {
			const allDanhGia = getDanhGias();
			const allLichHen = getLichHens();
			const daDanhGia = new Set(allDanhGia.map((item) => item.lichHenId));

			setDanhSach(allDanhGia);
			setLichHenHoanThanh(allLichHen.filter((item) => item.trangThai === 'HOAN_THANH' && !daDanhGia.has(item._id)));
			setNhanViens(getNhanViens());
			setDichVus(getDichVus());
		} finally {
			setLoading(false);
		}
	};

	const taoDanhGia = (payload: Omit<DatLich.DanhGia, '_id' | 'thoiGianDanhGia'>) => {
		try {
			createDanhGia(payload);
			message.success('Đánh giá thành công');
			getData();
			return true;
		} catch (error: any) {
			message.error(error?.message || 'Đánh giá thất bại');
			return false;
		}
	};

	const phanHoi = (id: string, noiDung: string) => {
		updatePhanHoiDanhGia(id, noiDung);
		message.success('Phản hồi thành công');
		getData();
	};

	return {
		danhSach,
		loading,
		lichHenHoanThanh,
		nhanViens,
		dichVus,
		getData,
		taoDanhGia,
		phanHoi,
	};
};
