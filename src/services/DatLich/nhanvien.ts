import { createId, KEY_NHAN_VIEN, readStore, seedData, writeStore } from './storage';

const getNhanViens = () => {
	seedData();
	return readStore<DatLich.NhanVien>(KEY_NHAN_VIEN);
};

const createNhanVien = (payload: Omit<DatLich.NhanVien, '_id'>) => {
	const data = getNhanViens();
	if (data.some((item) => item.maNhanVien === payload.maNhanVien)) {
		throw new Error(`Mã nhân viên "${payload.maNhanVien}" đã tồn tại`);
	}
	const record: DatLich.NhanVien = { ...payload, _id: createId('nv') };
	writeStore(KEY_NHAN_VIEN, [record, ...data]);
	return record;
};

const updateNhanVien = (id: string, payload: Omit<DatLich.NhanVien, '_id'>) => {
	const data = getNhanViens();
	if (data.some((item) => item.maNhanVien === payload.maNhanVien && item._id !== id)) {
		throw new Error(`Mã nhân viên "${payload.maNhanVien}" đã tồn tại`);
	}
	const next = data.map((item) => (item._id === id ? { ...item, ...payload, _id: id } : item));
	writeStore(KEY_NHAN_VIEN, next);
};

const deleteNhanVien = (id: string) => {
	const data = getNhanViens();
	writeStore(
		KEY_NHAN_VIEN,
		data.filter((item) => item._id !== id),
	);
};

export { getNhanViens, createNhanVien, updateNhanVien, deleteNhanVien };
