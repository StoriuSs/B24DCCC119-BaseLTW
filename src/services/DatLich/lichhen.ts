import moment from 'moment';
import { getDichVus } from './dichvu';
import { getNhanViens } from './nhanvien';
import { createId, KEY_LICH_HEN, readStore, writeStore } from './storage';

const toMinutes = (time: string) => {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
};

const hasOverlap = (startA: string, endA: string, startB: string, endB: string) => {
	const sA = toMinutes(startA);
	const eA = toMinutes(endA);
	const sB = toMinutes(startB);
	const eB = toMinutes(endB);
	return sA < eB && sB < eA;
};

const calcEndTime = (gioBatDau: string, thoiLuongPhut: number) => {
	const start = moment(gioBatDau, 'HH:mm');
	return start.add(thoiLuongPhut, 'minutes').format('HH:mm');
};

const getLichHens = () => readStore<DatLich.LichHen>(KEY_LICH_HEN);

const validateLichHen = (payload: {
	ngayHen: string;
	gioBatDau: string;
	gioKetThuc: string;
	nhanVienId: string;
	currentId?: string;
}) => {
	const nhanVien = getNhanViens().find((item) => item._id === payload.nhanVienId);
	if (!nhanVien) {
		return 'Không tìm thấy nhân viên';
	}

	const thu = moment(payload.ngayHen, 'YYYY-MM-DD').isoWeekday();
	const caHopLe = nhanVien.lichLamViec.find((item) => item.thu === thu);
	if (!caHopLe) {
		return 'Nhân viên không làm việc trong ngày đã chọn';
	}

	const start = toMinutes(payload.gioBatDau);
	const end = toMinutes(payload.gioKetThuc);
	const shiftStart = toMinutes(caHopLe.gioBatDau);
	const shiftEnd = toMinutes(caHopLe.gioKetThuc);
	if (start < shiftStart || end > shiftEnd) {
		return 'Khung giờ đặt lịch nằm ngoài lịch làm việc của nhân viên';
	}

	const lichHenTrongNgay = getLichHens().filter(
		(item) =>
			item._id !== payload.currentId &&
			item.nhanVienId === payload.nhanVienId &&
			item.ngayHen === payload.ngayHen &&
			item.trangThai !== 'HUY',
	);

	if (lichHenTrongNgay.length >= nhanVien.soKhachToiDaMoiNgay) {
		return 'Vượt quá số khách tối đa trong ngày của nhân viên';
	}

	const trungLich = lichHenTrongNgay.some((item) =>
		hasOverlap(payload.gioBatDau, payload.gioKetThuc, item.gioBatDau, item.gioKetThuc),
	);

	if (trungLich) {
		return 'Lịch hẹn bị trùng với khung giờ đã tồn tại';
	}

	return '';
};

const createLichHen = (payload: {
	tenKhachHang: string;
	soDienThoai: string;
	ngayHen: string;
	gioBatDau: string;
	nhanVienId: string;
	dichVuId: string;
	ghiChu?: string;
}) => {
	const dichVu = getDichVus().find((item) => item._id === payload.dichVuId);
	if (!dichVu) {
		throw new Error('Không tìm thấy dịch vụ');
	}

	const gioKetThuc = calcEndTime(payload.gioBatDau, dichVu.thoiLuongPhut);
	const error = validateLichHen({
		ngayHen: payload.ngayHen,
		gioBatDau: payload.gioBatDau,
		gioKetThuc,
		nhanVienId: payload.nhanVienId,
	});

	if (error) {
		throw new Error(error);
	}

	const data = getLichHens();
	const record: DatLich.LichHen = {
		_id: createId('lh'),
		maLichHen: `LH${Date.now().toString().slice(-6)}`,
		tenKhachHang: payload.tenKhachHang,
		soDienThoai: payload.soDienThoai,
		ngayHen: payload.ngayHen,
		gioBatDau: payload.gioBatDau,
		gioKetThuc,
		nhanVienId: payload.nhanVienId,
		dichVuId: payload.dichVuId,
		tongTien: dichVu.gia,
		trangThai: 'CHO_DUYET',
		ghiChu: payload.ghiChu,
		createdAt: new Date().toISOString(),
	};
	writeStore(KEY_LICH_HEN, [record, ...data]);
	return record;
};

const updateTrangThaiLichHen = (id: string, trangThai: DatLich.TrangThaiLichHen) => {
	const data = getLichHens();
	const next = data.map((item) => (item._id === id ? { ...item, trangThai } : item));
	writeStore(KEY_LICH_HEN, next);
};

const deleteLichHen = (id: string) => {
	const data = getLichHens();
	writeStore(
		KEY_LICH_HEN,
		data.filter((item) => item._id !== id),
	);
};

const getAvailableNhanViens = (ngayHen: string, gioBatDau: string, dichVuId: string): DatLich.NhanVien[] => {
	const dichVu = getDichVus().find((item) => item._id === dichVuId);
	if (!dichVu) return [];

	const gioKetThuc = calcEndTime(gioBatDau, dichVu.thoiLuongPhut);
	const thu = moment(ngayHen, 'YYYY-MM-DD').isoWeekday();
	const allNhanViens = getNhanViens().filter((item) => item.trangThai === 'ACTIVE');

	return allNhanViens.filter((nhanVien) => {
		const ca = nhanVien.lichLamViec.find((item) => item.thu === thu);
		if (!ca) return false;

		const start = toMinutes(gioBatDau);
		const end = toMinutes(gioKetThuc);
		if (start < toMinutes(ca.gioBatDau) || end > toMinutes(ca.gioKetThuc)) return false;

		const lichHenTrongNgay = getLichHens().filter(
			(item) => item.nhanVienId === nhanVien._id && item.ngayHen === ngayHen && item.trangThai !== 'HUY',
		);

		if (lichHenTrongNgay.length >= nhanVien.soKhachToiDaMoiNgay) return false;

		return !lichHenTrongNgay.some((item) => hasOverlap(gioBatDau, gioKetThuc, item.gioBatDau, item.gioKetThuc));
	});
};

export { getLichHens, createLichHen, updateTrangThaiLichHen, deleteLichHen, calcEndTime, getAvailableNhanViens };
