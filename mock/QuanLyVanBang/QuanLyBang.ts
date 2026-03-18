import { Request, Response } from 'express';

let soVanBangs: any[] = [
	{ _id: '1', id: '1', tenSo: 'Sổ cấp bằng Kỹ sư 2022', nam: 2022, soVaoSoHienTai: 9 },
	{ _id: '2', id: '2', tenSo: 'Sổ cấp bằng Cử nhân 2025', nam: 2025, soVaoSoHienTai: 5 },
	{ _id: '3', id: '3', tenSo: 'Sổ cấp bằng Thạc sĩ 2025', nam: 2025, soVaoSoHienTai: 4 },
];

let quyetDinhs: any[] = [
	{
		_id: '101',
		id: '101',
		soSQ: 'QD-KS/2022-01',
		ngayBanHanh: '2022-05-30',
		trichYeu: 'Công nhận tốt nghiệp kỹ sư đợt tháng 5/2022',
		soVanBangId: '1',
		soLuotTraCuu: 14,
	},
	{
		_id: '102',
		id: '102',
		soSQ: 'QD-KS/2022-02',
		ngayBanHanh: '2022-11-18',
		trichYeu: 'Công nhận tốt nghiệp kỹ sư đợt tháng 11/2022',
		soVanBangId: '1',
		soLuotTraCuu: 11,
	},
	{
		_id: '103',
		id: '103',
		soSQ: 'QD-CN/2025-01',
		ngayBanHanh: '2025-06-12',
		trichYeu: 'Công nhận tốt nghiệp cử nhân học kỳ II năm 2025',
		soVanBangId: '2',
		soLuotTraCuu: 6,
	},
	{
		_id: '104',
		id: '104',
		soSQ: 'QD-THS/2025-01',
		ngayBanHanh: '2025-08-02',
		trichYeu: 'Công nhận tốt nghiệp thạc sĩ đợt tháng 8/2025',
		soVanBangId: '3',
		soLuotTraCuu: 4,
	},
];

let cauHinhs: any[] = [
	{ _id: '201', id: '201', maTruong: 'chuyenNganh', tenTruong: 'Chuyên ngành', kieuDuLieu: 'String' },
	{ _id: '202', id: '202', maTruong: 'xepLoaiTN', tenTruong: 'Xếp loại tốt nghiệp', kieuDuLieu: 'String' },
	{ _id: '203', id: '203', maTruong: 'diemTichLuy', tenTruong: 'Điểm tích lũy', kieuDuLieu: 'Number' },
	{ _id: '204', id: '204', maTruong: 'ngayKyBang', tenTruong: 'Ngày ký văn bằng', kieuDuLieu: 'Date' },
];

let thongTinVanBangs: any[] = [
	{
		_id: '301',
		id: '301',
		soHieuVanBang: 'KS-2022-0101',
		soVaoSo: 1,
		maSinhVien: 'B21DCCN101',
		hoTen: 'Phan Đức Minh',
		ngaySinh: '2000-02-19',
		quyetDinhId: '101',
		extraFields: { chuyenNganh: 'Kỹ thuật phần mềm', xepLoaiTN: 'Giỏi', diemTichLuy: 3.42, ngayKyBang: '2022-06-03' },
	},
	{
		_id: '302',
		id: '302',
		soHieuVanBang: 'KS-2022-0102',
		soVaoSo: 2,
		maSinhVien: 'B21DCCN102',
		hoTen: 'Lâm Quỳnh Anh',
		ngaySinh: '2000-10-07',
		quyetDinhId: '101',
		extraFields: { chuyenNganh: 'Hệ thống thông tin', xepLoaiTN: 'Khá', diemTichLuy: 3.18, ngayKyBang: '2022-06-03' },
	},
	{
		_id: '303',
		id: '303',
		soHieuVanBang: 'KS-2022-0188',
		soVaoSo: 3,
		maSinhVien: 'B21DCCN188',
		hoTen: 'Tạ Hoài Nam',
		ngaySinh: '1999-12-28',
		quyetDinhId: '102',
		extraFields: { chuyenNganh: 'Mạng máy tính', xepLoaiTN: 'Giỏi', diemTichLuy: 3.51, ngayKyBang: '2022-11-25' },
	},
	{
		_id: '304',
		id: '304',
		soHieuVanBang: 'KS-2022-0196',
		soVaoSo: 4,
		maSinhVien: 'B21DCCN196',
		hoTen: 'Ngô Mai Lan',
		ngaySinh: '2000-05-22',
		quyetDinhId: '102',
		extraFields: {
			chuyenNganh: 'An toàn thông tin',
			xepLoaiTN: 'Xuất sắc',
			diemTichLuy: 3.84,
			ngayKyBang: '2022-11-25',
		},
	},
	{
		_id: '305',
		id: '305',
		soHieuVanBang: 'CN-2025-0007',
		soVaoSo: 1,
		maSinhVien: 'B22DCCQ007',
		hoTen: 'Vũ Tiến Đạt',
		ngaySinh: '2003-04-11',
		quyetDinhId: '103',
		extraFields: { chuyenNganh: 'Quản trị kinh doanh', xepLoaiTN: 'Khá', diemTichLuy: 3.06, ngayKyBang: '2025-06-20' },
	},
	{
		_id: '306',
		id: '306',
		soHieuVanBang: 'CN-2025-0012',
		soVaoSo: 2,
		maSinhVien: 'B22DCCQ012',
		hoTen: 'Đoàn Thảo Nhi',
		ngaySinh: '2003-09-14',
		quyetDinhId: '103',
		extraFields: { chuyenNganh: 'Thương mại điện tử', xepLoaiTN: 'Giỏi', diemTichLuy: 3.48, ngayKyBang: '2025-06-20' },
	},
	{
		_id: '307',
		id: '307',
		soHieuVanBang: 'THS-2025-0031',
		soVaoSo: 1,
		maSinhVien: 'M23CNTT031',
		hoTen: 'Trương Gia Bảo',
		ngaySinh: '1998-03-03',
		quyetDinhId: '104',
		extraFields: { chuyenNganh: 'Khoa học dữ liệu', xepLoaiTN: 'Giỏi', diemTichLuy: 3.62, ngayKyBang: '2025-08-09' },
	},
	{
		_id: '308',
		id: '308',
		soHieuVanBang: 'THS-2025-0044',
		soVaoSo: 2,
		maSinhVien: 'M23CNTT044',
		hoTen: 'Nguyễn Hải Yến',
		ngaySinh: '1997-08-30',
		quyetDinhId: '104',
		extraFields: {
			chuyenNganh: 'Trí tuệ nhân tạo',
			xepLoaiTN: 'Xuất sắc',
			diemTichLuy: 3.86,
			ngayKyBang: '2025-08-09',
		},
	},
];

const paginate = (data: any[], req: Request) => {
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const start = (page - 1) * limit;
	const end = start + limit;
	return {
		result: data.slice(start, end),
		total: data.length,
	};
};

export default {
	'GET /api/so-van-bang/page': (req: Request, res: Response) => {
		res.send({ data: paginate(soVanBangs, req) });
	},
	'GET /api/so-van-bang/many': (_req: Request, res: Response) => {
		res.send({ data: soVanBangs });
	},
	'POST /api/so-van-bang': (req: Request, res: Response) => {
		const newItem = { ...req.body, _id: Date.now().toString(), id: Date.now().toString(), soVaoSoHienTai: 1 };
		soVanBangs.push(newItem);
		res.send({ data: newItem });
	},
	'PUT /api/so-van-bang/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const index = soVanBangs.findIndex((i) => i.id === id || i._id === id);
		if (index !== -1) {
			soVanBangs[index] = { ...soVanBangs[index], ...req.body };
			res.send({ data: soVanBangs[index] });
		} else res.status(404).send({ message: 'Không tìm thấy' });
	},
	'DELETE /api/so-van-bang/:id': (req: Request, res: Response) => {
		soVanBangs = soVanBangs.filter((i) => i.id !== req.params.id && i._id !== req.params.id);
		res.send({ data: true });
	},

	'GET /api/quyet-dinh/page': (req: Request, res: Response) => {
		res.send({ data: paginate(quyetDinhs, req) });
	},
	'GET /api/quyet-dinh/many': (_req: Request, res: Response) => {
		res.send({ data: quyetDinhs });
	},
	'POST /api/quyet-dinh': (req: Request, res: Response) => {
		const newItem = { ...req.body, _id: Date.now().toString(), id: Date.now().toString(), soLuotTraCuu: 0 };
		quyetDinhs.push(newItem);
		res.send({ data: newItem });
	},
	'PUT /api/quyet-dinh/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const index = quyetDinhs.findIndex((i) => i.id === id || i._id === id);
		if (index !== -1) {
			quyetDinhs[index] = { ...quyetDinhs[index], ...req.body };
			res.send({ data: quyetDinhs[index] });
		} else res.status(404).send({ message: 'Không tìm thấy' });
	},
	'DELETE /api/quyet-dinh/:id': (req: Request, res: Response) => {
		quyetDinhs = quyetDinhs.filter((i) => i.id !== req.params.id && i._id !== req.params.id);
		res.send({ data: true });
	},

	'GET /api/cau-hinh/page': (req: Request, res: Response) => {
		res.send({ data: paginate(cauHinhs, req) });
	},
	'GET /api/cau-hinh/many': (_req: Request, res: Response) => {
		res.send({ data: cauHinhs });
	},
	'POST /api/cau-hinh': (req: Request, res: Response) => {
		const newCode = String(req.body?.maTruong || '')
			.trim()
			.toLowerCase();
		if (
			newCode &&
			cauHinhs.some(
				(item) =>
					String(item?.maTruong || '')
						.trim()
						.toLowerCase() === newCode,
			)
		) {
			return res.status(400).send({ message: 'Mã trường đã tồn tại' });
		}
		const newItem = { ...req.body, _id: Date.now().toString(), id: Date.now().toString() };
		cauHinhs.push(newItem);
		return res.send({ data: newItem });
	},
	'PUT /api/cau-hinh/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const index = cauHinhs.findIndex((i) => i.id === id || i._id === id);
		if (index !== -1) {
			const normalizedCode = String(req.body?.maTruong || '')
				.trim()
				.toLowerCase();
			if (
				normalizedCode &&
				cauHinhs.some(
					(item, itemIndex) =>
						itemIndex !== index &&
						String(item?.maTruong || '')
							.trim()
							.toLowerCase() === normalizedCode,
				)
			) {
				return res.status(400).send({ message: 'Mã trường đã tồn tại' });
			}
			cauHinhs[index] = { ...cauHinhs[index], ...req.body };
			return res.send({ data: cauHinhs[index] });
		}
		return res.status(404).send({ message: 'Không tìm thấy' });
	},
	'DELETE /api/cau-hinh/:id': (req: Request, res: Response) => {
		cauHinhs = cauHinhs.filter((i) => i.id !== req.params.id && i._id !== req.params.id);
		res.send({ data: true });
	},

	'GET /api/thong-tin-van-bang/page': (req: Request, res: Response) => {
		res.send({ data: paginate(thongTinVanBangs, req) });
	},
	'GET /api/thong-tin-van-bang/many': (_req: Request, res: Response) => {
		res.send({ data: thongTinVanBangs });
	},
	'POST /api/thong-tin-van-bang': (req: Request, res: Response) => {
		const { quyetDinhId, ...data } = req.body;

		const qd = quyetDinhs.find((i) => i.id === quyetDinhId || i._id === quyetDinhId);
		if (!qd) return res.status(400).send({ message: 'Không tìm thấy quyết định' });

		const so = soVanBangs.find((s) => s.id === qd.soVanBangId || s._id === qd.soVanBangId);
		if (!so) return res.status(400).send({ message: 'Quyết định này thuộc về sổ không tồn tại' });

		const newRecord = {
			...data,
			_id: Date.now().toString(),
			id: Date.now().toString(),
			quyetDinhId: qd.id || qd._id,
			soVaoSo: so.soVaoSoHienTai,
		};

		so.soVaoSoHienTai += 1;
		thongTinVanBangs.push(newRecord);
		return res.send({ data: newRecord });
	},
	'DELETE /api/thong-tin-van-bang/:id': (req: Request, res: Response) => {
		thongTinVanBangs = thongTinVanBangs.filter((i) => i.id !== req.params.id && i._id !== req.params.id);
		res.send({ data: true });
	},

	'GET /api/tra-cuu': (req: Request, res: Response) => {
		const query = req.query;
		const activeParams = Object.entries(query).filter(([_, v]) => v !== undefined && v !== '');

		if (activeParams.length < 2) {
			return res.status(400).send({ message: 'Yêu cầu nhập ít nhất 2 tham số để tra cứu' });
		}

		const filtered = thongTinVanBangs.filter((t) => {
			return activeParams.every(([key, value]) => {
				const val = (t[key] !== undefined ? t[key] : t.extraFields?.[key]) || '';
				return val.toString().toLowerCase().includes(value!.toString().toLowerCase());
			});
		});

		if (filtered.length > 0) {
			const countedQdIds = new Set<string>();
			filtered.forEach((item) => {
				const qdId = item.quyetDinhId;
				if (!countedQdIds.has(qdId)) {
					countedQdIds.add(qdId);
					const qd = quyetDinhs.find((q) => q.id === qdId || q._id === qdId);
					if (qd) qd.soLuotTraCuu = (qd.soLuotTraCuu || 0) + 1;
				}
			});
		}

		return res.send({ data: filtered });
	},
};
