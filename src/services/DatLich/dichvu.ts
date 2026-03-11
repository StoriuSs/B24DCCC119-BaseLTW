import { createId, KEY_DICH_VU, readStore, seedData, writeStore } from './storage';

const getDichVus = () => {
	seedData();
	return readStore<DatLich.DichVu>(KEY_DICH_VU);
};

const createDichVu = (payload: Omit<DatLich.DichVu, '_id'>) => {
	const data = getDichVus();
	if (data.some((item) => item.maDichVu === payload.maDichVu)) {
		throw new Error(`Mã dịch vụ "${payload.maDichVu}" đã tồn tại`);
	}
	const record: DatLich.DichVu = { ...payload, _id: createId('dv') };
	writeStore(KEY_DICH_VU, [record, ...data]);
	return record;
};

const updateDichVu = (id: string, payload: Omit<DatLich.DichVu, '_id'>) => {
	const data = getDichVus();
	if (data.some((item) => item.maDichVu === payload.maDichVu && item._id !== id)) {
		throw new Error(`Mã dịch vụ "${payload.maDichVu}" đã tồn tại`);
	}
	const next = data.map((item) => (item._id === id ? { ...item, ...payload, _id: id } : item));
	writeStore(KEY_DICH_VU, next);
};

const deleteDichVu = (id: string) => {
	const data = getDichVus();
	writeStore(
		KEY_DICH_VU,
		data.filter((item) => item._id !== id),
	);
};

export { getDichVus, createDichVu, updateDichVu, deleteDichVu };
