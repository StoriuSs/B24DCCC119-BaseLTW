import { getLichHens } from './lichhen';
import { createId, KEY_DANH_GIA, readStore, writeStore } from './storage';

const getDanhGias = () => readStore<DatLich.DanhGia>(KEY_DANH_GIA);

const createDanhGia = (payload: Omit<DatLich.DanhGia, '_id' | 'thoiGianDanhGia'>) => {
	const lichHen = getLichHens().find((item) => item._id === payload.lichHenId);
	if (!lichHen || lichHen.trangThai !== 'HOAN_THANH') {
		throw new Error('Chỉ được đánh giá khi lịch hẹn đã hoàn thành');
	}

	const daDanhGia = getDanhGias().some((item) => item.lichHenId === payload.lichHenId);
	if (daDanhGia) {
		throw new Error('Lịch hẹn này đã được đánh giá');
	}

	const data = getDanhGias();
	const record: DatLich.DanhGia = {
		_id: createId('dg'),
		...payload,
		thoiGianDanhGia: new Date().toISOString(),
	};
	writeStore(KEY_DANH_GIA, [record, ...data]);
	return record;
};

const updatePhanHoiDanhGia = (id: string, phanHoiNhanVien: string) => {
	const data = getDanhGias();
	const next = data.map((item) => (item._id === id ? { ...item, phanHoiNhanVien } : item));
	writeStore(KEY_DANH_GIA, next);
};

export { getDanhGias, createDanhGia, updatePhanHoiDanhGia };
