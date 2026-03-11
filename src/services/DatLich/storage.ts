const KEY_NHAN_VIEN = 'app_datlich_nhanvien';
const KEY_DICH_VU = 'app_datlich_dichvu';
const KEY_LICH_HEN = 'app_datlich_lichhen';
const KEY_DANH_GIA = 'app_datlich_danhgia';

type StoreKey = typeof KEY_NHAN_VIEN | typeof KEY_DICH_VU | typeof KEY_LICH_HEN | typeof KEY_DANH_GIA;

const readStore = <T>(key: StoreKey): T[] => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T[]) : [];
	} catch {
		return [];
	}
};

const writeStore = <T>(key: StoreKey, data: T[]) => {
	localStorage.setItem(key, JSON.stringify(data));
};

const createId = (prefix = '') =>
	`${prefix ? prefix + '_' : ''}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedData = () => {
	const nhanViens = readStore<DatLich.NhanVien>(KEY_NHAN_VIEN);
	const dichVus = readStore<DatLich.DichVu>(KEY_DICH_VU);

	if (!nhanViens.length) {
		writeStore<DatLich.NhanVien>(KEY_NHAN_VIEN, [
			{
				_id: createId('nv'),
				maNhanVien: 'NV001',
				tenNhanVien: 'Nhân Viên 1',
				soKhachToiDaMoiNgay: 8,
				lichLamViec: [
					{ thu: 1, gioBatDau: '09:00', gioKetThuc: '17:00' },
					{ thu: 2, gioBatDau: '09:00', gioKetThuc: '17:00' },
					{ thu: 3, gioBatDau: '09:00', gioKetThuc: '17:00' },
					{ thu: 4, gioBatDau: '09:00', gioKetThuc: '17:00' },
					{ thu: 5, gioBatDau: '09:00', gioKetThuc: '17:00' },
				],
				trangThai: 'ACTIVE',
			},
			{
				_id: createId('nv'),
				maNhanVien: 'NV002',
				tenNhanVien: 'Nhân Viên 2',
				soKhachToiDaMoiNgay: 6,
				lichLamViec: [
					{ thu: 1, gioBatDau: '08:00', gioKetThuc: '16:00' },
					{ thu: 2, gioBatDau: '08:00', gioKetThuc: '16:00' },
					{ thu: 3, gioBatDau: '08:00', gioKetThuc: '16:00' },
					{ thu: 4, gioBatDau: '08:00', gioKetThuc: '16:00' },
					{ thu: 5, gioBatDau: '08:00', gioKetThuc: '16:00' },
				],
				trangThai: 'ACTIVE',
			},
		]);
	}

	if (!dichVus.length) {
		writeStore<DatLich.DichVu>(KEY_DICH_VU, [
			{
				_id: createId('dv'),
				maDichVu: 'DV001',
				tenDichVu: 'Cắt tóc',
				gia: 120000,
				thoiLuongPhut: 45,
				moTa: 'Cắt tóc cơ bản',
				trangThai: 'ACTIVE',
			},
			{
				_id: createId('dv'),
				maDichVu: 'DV002',
				tenDichVu: 'Spa',
				gia: 300000,
				thoiLuongPhut: 90,
				moTa: 'Chăm sóc da mặt',
				trangThai: 'ACTIVE',
			},
		]);
	}
};

export { KEY_NHAN_VIEN, KEY_DICH_VU, KEY_LICH_HEN, KEY_DANH_GIA, readStore, writeStore, createId, seedData };
