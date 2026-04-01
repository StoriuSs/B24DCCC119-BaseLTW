import { Request, Response } from 'express';

const parseQueryObject = (value: any) => {
	if (!value) return {};
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch (error) {
			return {};
		}
	}
	if (typeof value === 'object') return value;
	return {};
};

const parseQueryArray = (value: any) => {
	if (!value) return [];
	if (Array.isArray(value)) return value;
	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed : [];
		} catch (error) {
			return [];
		}
	}
	if (typeof value === 'object') return Object.values(value).filter(Boolean);
	return [];
};

const getValueByField = (record: any, field: string | string[]) => {
	if (Array.isArray(field)) {
		return field.reduce((acc, key) => (acc ? acc[key] : undefined), record);
	}
	if (typeof field === 'string' && field.includes('.')) {
		return field.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), record);
	}
	return record[field as string];
};

const applyConditionAndFilters = (data: any[], req: Request) => {
	const condition = parseQueryObject(req.query.condition);
	const filters = parseQueryArray(req.query.filters);
	const sort = parseQueryObject(req.query.sort);

	let result = [...data];

	if (Object.keys(condition).length) {
		result = result.filter((item) =>
			Object.entries(condition).every(([key, value]) => {
				if (value === undefined || value === null || value === '') return true;
				return String(item[key]) === String(value);
			}),
		);
	}

	if (filters.length) {
		filters.forEach((filter: any) => {
			const field = filter?.field;
			const operator = String(filter?.operator || '').toLowerCase();
			const values = Array.isArray(filter?.values) ? filter.values : [];
			if (!field || !values.length) return;
			result = result.filter((item) => {
				const raw = getValueByField(item, field);
				const text = String(raw ?? '').toLowerCase();
				if (operator === 'contain') {
					return values.some((v: any) => text.includes(String(v ?? '').toLowerCase()));
				}
				if (operator === 'in') {
					return values.some((v: any) => String(raw) === String(v));
				}
				return true;
			});
		});
	}

	const [sortField, sortValue] = Object.entries(sort || {})[0] || [];
	if (sortField && (sortValue === 1 || sortValue === -1)) {
		result.sort((a, b) => {
			const av = getValueByField(a, sortField);
			const bv = getValueByField(b, sortField);
			if (av == null && bv == null) return 0;
			if (av == null) return -1 * (sortValue as number);
			if (bv == null) return 1 * (sortValue as number);
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * (sortValue as number);
			return String(av).localeCompare(String(bv), 'vi') * (sortValue as number);
		});
	}

	return result;
};

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

let diemDens = [
	{
		_id: 'dd1',
		id: 'dd1',
		ten: 'Vịnh Hạ Long',
		diaDiem: 'Quảng Ninh',
		loaiHinh: 'Bien',
		rating: 4.8,
		giaTrungBinh: 2500000,
		thoiGianThamQuanGio: 8,
		chiPhiAnUong: 500000,
		chiPhiLuuTru: 1200000,
		chiPhiDiChuyen: 800000,
		moTa: 'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi.',
		hinhAnh: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=60',
		noiBat: true,
	},
	{
		_id: 'dd2',
		id: 'dd2',
		ten: 'Sa Pa',
		diaDiem: 'Lào Cai',
		loaiHinh: 'Nui',
		rating: 4.7,
		giaTrungBinh: 2200000,
		thoiGianThamQuanGio: 10,
		chiPhiAnUong: 450000,
		chiPhiLuuTru: 1000000,
		chiPhiDiChuyen: 750000,
		moTa: 'Khí hậu mát mẻ, cảnh quan ruộng bậc thang và văn hóa bản địa.',
		hinhAnh: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60',
		noiBat: true,
	},
	{
		_id: 'dd3',
		id: 'dd3',
		ten: 'Đà Nẵng',
		diaDiem: 'Đà Nẵng',
		loaiHinh: 'Thanh pho',
		rating: 4.6,
		giaTrungBinh: 2000000,
		thoiGianThamQuanGio: 9,
		chiPhiAnUong: 550000,
		chiPhiLuuTru: 900000,
		chiPhiDiChuyen: 700000,
		moTa: 'Thành phố đáng sống với biển đẹp và ẩm thực phong phú.',
		hinhAnh: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=60',
		noiBat: true,
	},
	{
		_id: 'dd4',
		id: 'dd4',
		ten: 'Nha Trang',
		diaDiem: 'Khánh Hòa',
		loaiHinh: 'Bien',
		rating: 4.5,
		giaTrungBinh: 2100000,
		thoiGianThamQuanGio: 7,
		chiPhiAnUong: 480000,
		chiPhiLuuTru: 950000,
		chiPhiDiChuyen: 650000,
		moTa: 'Biển xanh, cát trắng, nắng vàng phù hợp nghỉ dưỡng.',
		hinhAnh: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=60',
		noiBat: false,
	},
];

let lichTrinhs = [
	{ _id: 'lt1', id: 'lt1', ngay: 1, diemDenId: 'dd3', thuTu: 1, thoiGianDiChuyenGio: 1.5, ghiChu: 'Check-in buoi sang' },
	{ _id: 'lt2', id: 'lt2', ngay: 1, diemDenId: 'dd4', thuTu: 2, thoiGianDiChuyenGio: 2, ghiChu: 'Tam bien buoi chieu' },
	{ _id: 'lt3', id: 'lt3', ngay: 2, diemDenId: 'dd1', thuTu: 1, thoiGianDiChuyenGio: 2.5, ghiChu: '' },
];

let nguonNganSachs = [
	{ _id: 'ns1', id: 'ns1', tenNguon: 'Lương tháng', loaiNguon: 'Thu nhap', soTien: 7000000, ghiChu: '' },
	{ _id: 'ns2', id: 'ns2', tenNguon: 'Quỹ tiết kiệm', loaiNguon: 'Tiet kiem', soTien: 3500000, ghiChu: '' },
	{ _id: 'ns3', id: 'ns3', tenNguon: 'Thưởng dự án', loaiNguon: 'Khac', soTien: 2000000, ghiChu: '' },
];

let cauHinhPhanBos = [
	{
		_id: 'pb1',
		id: 'pb1',
		tenCauHinh: 'Cân bằng',
		anUongPct: 25,
		diChuyenPct: 25,
		luuTruPct: 35,
		thamQuanPct: 15,
		macDinh: true,
	},
];

export default {
	'GET /api/du-lich/diem-den/page': (req: Request, res: Response) => {
		const finalData = applyConditionAndFilters(diemDens, req);
		res.send({ data: paginate(finalData, req) });
	},
	'GET /api/du-lich/diem-den/many': (_req: Request, res: Response) => {
		res.send({ data: diemDens });
	},
	'POST /api/du-lich/diem-den': (req: Request, res: Response) => {
		const id = `dd_${Date.now()}`;
		const row = { ...req.body, _id: id, id };
		diemDens.push(row);
		res.send({ data: row });
	},
	'PUT /api/du-lich/diem-den/:id': (req: Request, res: Response) => {
		const idx = diemDens.findIndex((x) => x.id === req.params.id || x._id === req.params.id);
		if (idx < 0) {
			res.status(404).send({ message: 'Not found' });
			return;
		}
		diemDens[idx] = { ...diemDens[idx], ...req.body };
		res.send({ data: diemDens[idx] });
	},
	'DELETE /api/du-lich/diem-den/:id': (req: Request, res: Response) => {
		diemDens = diemDens.filter((x) => x.id !== req.params.id && x._id !== req.params.id);
		res.send({ data: true });
	},

	'GET /api/du-lich/lich-trinh/page': (req: Request, res: Response) => {
		const finalData = applyConditionAndFilters(lichTrinhs, req);
		res.send({ data: paginate(finalData, req) });
	},
	'GET /api/du-lich/lich-trinh/many': (_req: Request, res: Response) => {
		res.send({ data: lichTrinhs });
	},
	'POST /api/du-lich/lich-trinh': (req: Request, res: Response) => {
		const id = `lt_${Date.now()}`;
		const row = { ...req.body, _id: id, id };
		lichTrinhs.push(row);
		res.send({ data: row });
	},
	'PUT /api/du-lich/lich-trinh/:id': (req: Request, res: Response) => {
		const idx = lichTrinhs.findIndex((x) => x.id === req.params.id || x._id === req.params.id);
		if (idx < 0) {
			res.status(404).send({ message: 'Not found' });
			return;
		}
		lichTrinhs[idx] = { ...lichTrinhs[idx], ...req.body };
		res.send({ data: lichTrinhs[idx] });
	},
	'DELETE /api/du-lich/lich-trinh/:id': (req: Request, res: Response) => {
		lichTrinhs = lichTrinhs.filter((x) => x.id !== req.params.id && x._id !== req.params.id);
		res.send({ data: true });
	},

	'GET /api/du-lich/ngan-sach/tong-quan': (_req: Request, res: Response) => {
		const cauHinhDangDung = cauHinhPhanBos.find((x) => x.macDinh) || cauHinhPhanBos[0];
		const tongChiPhiCoSo = lichTrinhs.reduce((sum, item) => {
			const dd = diemDens.find((x) => x.id === item.diemDenId);
			if (!dd) return sum;
			return sum + dd.chiPhiAnUong + dd.chiPhiDiChuyen + dd.chiPhiLuuTru + Math.round(dd.giaTrungBinh * 0.2);
		}, 0);

		const anUong = Math.round((tongChiPhiCoSo * Number(cauHinhDangDung?.anUongPct || 0)) / 100);
		const diChuyen = Math.round((tongChiPhiCoSo * Number(cauHinhDangDung?.diChuyenPct || 0)) / 100);
		const luuTru = Math.round((tongChiPhiCoSo * Number(cauHinhDangDung?.luuTruPct || 0)) / 100);
		const thamQuan = tongChiPhiCoSo - anUong - diChuyen - luuTru;

		const tongNguon = nguonNganSachs.reduce((sum, item) => sum + Number(item.soTien || 0), 0);

		res.send({
			data: {
				nganSachToiDa: tongNguon,
				anUong,
				diChuyen,
				luuTru,
				thamQuan,
				tenCauHinhPhanBo: cauHinhDangDung?.tenCauHinh,
			},
		});
	},
	'GET /api/du-lich/ngan-sach/page': (req: Request, res: Response) => {
		const finalData = applyConditionAndFilters(nguonNganSachs, req);
		res.send({ data: paginate(finalData, req) });
	},
	'GET /api/du-lich/ngan-sach/many': (_req: Request, res: Response) => {
		res.send({ data: nguonNganSachs });
	},
	'POST /api/du-lich/ngan-sach': (req: Request, res: Response) => {
		const id = `ns_${Date.now()}`;
		const row = { ...req.body, _id: id, id };
		nguonNganSachs.push(row);
		res.send({ data: row });
	},
	'PUT /api/du-lich/ngan-sach/:id': (req: Request, res: Response) => {
		const idx = nguonNganSachs.findIndex((x) => x.id === req.params.id || x._id === req.params.id);
		if (idx < 0) {
			res.status(404).send({ message: 'Not found' });
			return;
		}
		nguonNganSachs[idx] = { ...nguonNganSachs[idx], ...req.body };
		res.send({ data: nguonNganSachs[idx] });
	},
	'DELETE /api/du-lich/ngan-sach/:id': (req: Request, res: Response) => {
		nguonNganSachs = nguonNganSachs.filter((x) => x.id !== req.params.id && x._id !== req.params.id);
		res.send({ data: true });
	},
	'GET /api/du-lich/phan-bo-chi-tieu/page': (req: Request, res: Response) => {
		const finalData = applyConditionAndFilters(cauHinhPhanBos, req);
		res.send({ data: paginate(finalData, req) });
	},
	'GET /api/du-lich/phan-bo-chi-tieu/many': (_req: Request, res: Response) => {
		res.send({ data: cauHinhPhanBos });
	},
	'POST /api/du-lich/phan-bo-chi-tieu': (req: Request, res: Response) => {
		const body = req.body || {};
		const tongPct = Number(body.anUongPct || 0) + Number(body.diChuyenPct || 0) + Number(body.luuTruPct || 0) + Number(body.thamQuanPct || 0);
		if (tongPct !== 100) {
			res.status(400).send({ message: 'Tổng tỷ lệ phải bằng 100%' });
			return;
		}

		const id = `pb_${Date.now()}`;
		if (body.macDinh) {
			cauHinhPhanBos = cauHinhPhanBos.map((x) => ({ ...x, macDinh: false }));
		}
		const row = { ...body, _id: id, id };
		cauHinhPhanBos.push(row);
		res.send({ data: row });
	},
	'PUT /api/du-lich/phan-bo-chi-tieu/:id': (req: Request, res: Response) => {
		const body = req.body || {};
		const tongPct = Number(body.anUongPct || 0) + Number(body.diChuyenPct || 0) + Number(body.luuTruPct || 0) + Number(body.thamQuanPct || 0);
		if (tongPct !== 100) {
			res.status(400).send({ message: 'Tổng tỷ lệ phải bằng 100%' });
			return;
		}

		const idx = cauHinhPhanBos.findIndex((x) => x.id === req.params.id || x._id === req.params.id);
		if (idx < 0) {
			res.status(404).send({ message: 'Not found' });
			return;
		}

		if (body.macDinh) {
			cauHinhPhanBos = cauHinhPhanBos.map((x) => ({ ...x, macDinh: false }));
		}
		cauHinhPhanBos[idx] = { ...cauHinhPhanBos[idx], ...body };
		res.send({ data: cauHinhPhanBos[idx] });
	},
	'DELETE /api/du-lich/phan-bo-chi-tieu/:id': (req: Request, res: Response) => {
		const current = cauHinhPhanBos.find((x) => x.id === req.params.id || x._id === req.params.id);
		cauHinhPhanBos = cauHinhPhanBos.filter((x) => x.id !== req.params.id && x._id !== req.params.id);
		if (current?.macDinh && cauHinhPhanBos.length) {
			cauHinhPhanBos[0].macDinh = true;
		}
		res.send({ data: true });
	},
	'GET /api/du-lich/admin/thong-ke': (_req: Request, res: Response) => {
		res.send({
			data: {
				tongLichTrinhTheoThang: [
					{ thang: '01', soLuong: 20 },
					{ thang: '02', soLuong: 30 },
					{ thang: '03', soLuong: 24 },
				],
				diaDiemPhoBien: [
					{ ten: 'Đà Nẵng', luotChon: 20 },
					{ ten: 'Hạ Long', luotChon: 15 },
				],
				tongDoanhThu: 250000000,
				doanhThuTheoHangMuc: {
					nganSachToiDa: 0,
					anUong: 60000000,
					diChuyen: 70000000,
					luuTru: 90000000,
					thamQuan: 30000000,
				},
			},
		});
	},
};
