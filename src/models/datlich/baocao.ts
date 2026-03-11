import moment from 'moment';
import { useState } from 'react';
import { getDichVus } from '@/services/DatLich/dichvu';
import { getLichHens } from '@/services/DatLich/lichhen';
import { getNhanViens } from '@/services/DatLich/nhanvien';

export default () => {
	const [lichTheoNgay, setLichTheoNgay] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
	const [lichTheoThang, setLichTheoThang] = useState<{ labels: string[]; values: number[] }>({
		labels: [],
		values: [],
	});
	const [doanhThuTheoDichVu, setDoanhThuTheoDichVu] = useState<{ labels: string[]; values: number[] }>({
		labels: [],
		values: [],
	});
	const [doanhThuTheoNhanVien, setDoanhThuTheoNhanVien] = useState<{ labels: string[]; values: number[] }>({
		labels: [],
		values: [],
	});

	const getData = () => {
		const lichHens = getLichHens().filter((item) => item.trangThai !== 'HUY');
		const lichHoanThanh = lichHens.filter((item) => item.trangThai === 'HOAN_THANH');
		const dichVus = getDichVus();
		const nhanViens = getNhanViens();

		const monthMap = new Map<string, number>();
		const dayMap = new Map<string, number>();
		const nowMonth = moment().format('YYYY-MM');

		lichHens.forEach((item) => {
			const monthKey = moment(item.ngayHen).format('MM/YYYY');
			monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);

			if (moment(item.ngayHen).format('YYYY-MM') === nowMonth) {
				const dayKey = moment(item.ngayHen).format('DD/MM');
				dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
			}
		});

		const monthLabels = Array.from(monthMap.keys()).sort(
			(a, b) => moment(a, 'MM/YYYY').valueOf() - moment(b, 'MM/YYYY').valueOf(),
		);
		const dayLabels = Array.from(dayMap.keys()).sort(
			(a, b) => moment(a, 'DD/MM').valueOf() - moment(b, 'DD/MM').valueOf(),
		);

		setLichTheoThang({ labels: monthLabels, values: monthLabels.map((item) => monthMap.get(item) || 0) });
		setLichTheoNgay({ labels: dayLabels, values: dayLabels.map((item) => dayMap.get(item) || 0) });

		const doanhThuDichVuMap = new Map<string, number>();
		dichVus.forEach((dv) => {
			const tong = lichHoanThanh.filter((lh) => lh.dichVuId === dv._id).reduce((sum, item) => sum + item.tongTien, 0);
			doanhThuDichVuMap.set(dv.tenDichVu, tong);
		});

		const doanhThuNhanVienMap = new Map<string, number>();
		nhanViens.forEach((nv) => {
			const tong = lichHoanThanh.filter((lh) => lh.nhanVienId === nv._id).reduce((sum, item) => sum + item.tongTien, 0);
			doanhThuNhanVienMap.set(nv.tenNhanVien, tong);
		});

		const dichVuLabels = Array.from(doanhThuDichVuMap.keys());
		const nhanVienLabels = Array.from(doanhThuNhanVienMap.keys());

		setDoanhThuTheoDichVu({
			labels: dichVuLabels,
			values: dichVuLabels.map((item) => doanhThuDichVuMap.get(item) || 0),
		});
		setDoanhThuTheoNhanVien({
			labels: nhanVienLabels,
			values: nhanVienLabels.map((item) => doanhThuNhanVienMap.get(item) || 0),
		});
	};

	return {
		lichTheoNgay,
		lichTheoThang,
		doanhThuTheoDichVu,
		doanhThuTheoNhanVien,
		getData,
	};
};
