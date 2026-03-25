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
	if (typeof value === 'object') {
		// Support qs-style objects: {"0": {...}, "1": {...}} or nested objects.
		const items = Object.values(value).flatMap((item: any) => {
			if (!item) return [];
			if (Array.isArray(item)) return item;
			if (typeof item === 'string') {
				try {
					const parsed = JSON.parse(item);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch (error) {
					return [];
				}
			}
			return [item];
		});
		return items.filter(Boolean);
	}
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
			if (!filter?.active && filter?.active !== undefined) return;
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

let cauLacBos: any[] = [
	{
		_id: '1',
		id: '1',
		anhDaiDien: 'https://via.placeholder.com/100?text=CLB1',
		tenCLB: 'Câu lạc bộ Lập trình',
		ngayThanhLap: '2022-01-15',
		moTa: '<p>Câu lạc bộ dành cho những bạn yêu thích lập trình và phát triển phần mềm</p>',
		chuNhiem: 'Lê Thị Minh Châu',
		hoatDong: true,
	},
	{
		_id: '2',
		id: '2',
		anhDaiDien: 'https://via.placeholder.com/100?text=CLB2',
		tenCLB: 'Câu lạc bộ Thiết kế Đồ họa',
		ngayThanhLap: '2021-06-20',
		moTa: '<p>Nơi các bạn có thể học hỏi và chia sẻ kiến thức về thiết kế đồ họa, UI/UX</p>',
		chuNhiem: 'Phạm Văn Hùng',
		hoatDong: true,
	},
	{
		_id: '3',
		id: '3',
		anhDaiDien: 'https://via.placeholder.com/100?text=CLB3',
		tenCLB: 'Câu lạc bộ Marketing Digital',
		ngayThanhLap: '2023-03-10',
		moTa: '<p>Tìm hiểu về marketing digital, SEO, SEM, social media</p>',
		chuNhiem: 'Nguyễn Thị Hương',
		hoatDong: true,
	},
	{
		_id: '4',
		id: '4',
		anhDaiDien: 'https://via.placeholder.com/100?text=CLB4',
		tenCLB: 'Câu lạc bộ Tiếng Anh',
		ngayThanhLap: '2020-09-05',
		moTa: '<p>Cộng đồng học tiếng Anh, trao đổi ngôn ngữ và văn hóa</p>',
		chuNhiem: 'Trần Quốc Bảo',
		hoatDong: false,
	},
	{
		_id: '5',
		id: '5',
		anhDaiDien: 'https://via.placeholder.com/100?text=CLB5',
		tenCLB: 'Câu lạc bộ Thể thao',
		ngayThanhLap: '2019-02-28',
		moTa: '<p>Tổ chức các hoạt động thể thao, rèn luyện sức khỏe</p>',
		chuNhiem: 'Vũ Đình Trung',
		hoatDong: true,
	},
];

let donDangKys: any[] = [
	{
		_id: '101',
		id: '101',
		hoTen: 'Phạm Minh Huy',
		email: 'huy.pham@example.com',
		sdt: '0901234567',
		gioiTinh: 'Nam',
		diaChi: '123 Đường A, Quận 1, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '1',
		lyDoDangKy: 'Muốn học thêm về lập trình web và phát triển ứng dụng',
		trangThai: 'Approved',
		ghiChu: '',
		lichSu: [{ hanhDong: 'Approved', thoiGian: '2025-03-20T10:30:00', nguoiThucHien: 'Admin', lyDo: '' }],
		ngayDangKy: '2025-03-18',
	},
	{
		_id: '102',
		id: '102',
		hoTen: 'Trần Thị Linh',
		email: 'linh.tran@example.com',
		sdt: '0912345678',
		gioiTinh: 'Nữ',
		diaChi: '456 Đường B, Quận 3, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '2',
		lyDoDangKy: 'Muốn phát triển kỹ năng thiết kế đồ họa',
		trangThai: 'Approved',
		ghiChu: '',
		lichSu: [{ hanhDong: 'Approved', thoiGian: '2025-03-21T14:15:00', nguoiThucHien: 'Admin', lyDo: '' }],
		ngayDangKy: '2025-03-19',
	},
	{
		_id: '103',
		id: '103',
		hoTen: 'Lê Văn Toàn',
		email: 'toan.le@example.com',
		sdt: '0923456789',
		gioiTinh: 'Nam',
		diaChi: '789 Đường C, Quận 2, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '1',
		lyDoDangKy: 'Quan tâm đến lập trình backend',
		trangThai: 'Pending',
		ghiChu: '',
		lichSu: [],
		ngayDangKy: '2025-03-22',
	},
	{
		_id: '104',
		id: '104',
		hoTen: 'Nguyễn Thị Hoa',
		email: 'hoa.nguyen@example.com',
		sdt: '0934567890',
		gioiTinh: 'Nữ',
		diaChi: '321 Đường D, Quận 5, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '3',
		lyDoDangKy: 'Muốn học marketing digital',
		trangThai: 'Rejected',
		ghiChu: 'Không đủ điều kiện tham gia',
		lichSu: [
			{
				hanhDong: 'Rejected',
				thoiGian: '2025-03-20T16:45:00',
				nguoiThucHien: 'Admin',
				lyDo: 'Không đủ điều kiện tham gia',
			},
		],
		ngayDangKy: '2025-03-17',
	},
	{
		_id: '105',
		id: '105',
		hoTen: 'Đỗ Minh Tuấn',
		email: 'tuan.do@example.com',
		sdt: '0945678901',
		gioiTinh: 'Nam',
		diaChi: '654 Đường E, Quận 4, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '5',
		lyDoDangKy: 'Muốn tham gia các hoạt động thể thao',
		trangThai: 'Approved',
		ghiChu: '',
		lichSu: [{ hanhDong: 'Approved', thoiGian: '2025-03-21T09:20:00', nguoiThucHien: 'Admin', lyDo: '' }],
		ngayDangKy: '2025-03-21',
	},
	{
		_id: '106',
		id: '106',
		hoTen: 'Vũ Thị Lan',
		email: 'lan.vu@example.com',
		sdt: '0956789012',
		gioiTinh: 'Nữ',
		diaChi: '987 Đường F, Quận 6, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '2',
		lyDoDangKy: 'Quan tâm thiết kế UI/UX',
		trangThai: 'Pending',
		ghiChu: '',
		lichSu: [],
		ngayDangKy: '2025-03-23',
	},
	{
		_id: '107',
		id: '107',
		hoTen: 'Hoàng Văn Sơn',
		email: 'son.hoang@example.com',
		sdt: '0967890123',
		gioiTinh: 'Nam',
		diaChi: '147 Đường G, Quận 7, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '1',
		lyDoDangKy: 'Muốn nâng cao kỹ năng lập trình',
		trangThai: 'Approved',
		ghiChu: '',
		lichSu: [{ hanhDong: 'Approved', thoiGian: '2025-03-22T11:00:00', nguoiThucHien: 'Admin', lyDo: '' }],
		ngayDangKy: '2025-03-20',
	},
	{
		_id: '108',
		id: '108',
		hoTen: 'Phan Thị Yên',
		email: 'yen.phan@example.com',
		sdt: '0978901234',
		gioiTinh: 'Nữ',
		diaChi: '258 Đường H, Quận 8, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '3',
		lyDoDangKy: 'Khám phá marketing digital',
		trangThai: 'Rejected',
		ghiChu: 'Chưa có kinh nghiệm tối thiểu',
		lichSu: [
			{
				hanhDong: 'Rejected',
				thoiGian: '2025-03-21T15:30:00',
				nguoiThucHien: 'Admin',
				lyDo: 'Chưa có kinh nghiệm tối thiểu',
			},
		],
		ngayDangKy: '2025-03-16',
	},
	{
		_id: '109',
		id: '109',
		hoTen: 'Trần Quốc Khánh',
		email: 'khanh.tran@example.com',
		sdt: '0989012345',
		gioiTinh: 'Nam',
		diaChi: '369 Đường I, Quận 9, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '2',
		lyDoDangKy: 'Thiết kế là đam mê của tôi',
		trangThai: 'Pending',
		ghiChu: '',
		lichSu: [],
		ngayDangKy: '2025-03-24',
	},
	{
		_id: '110',
		id: '110',
		hoTen: 'Lương Thị Hà',
		email: 'ha.luong@example.com',
		sdt: '0990123456',
		gioiTinh: 'Nữ',
		diaChi: '741 Đường J, Quận 10, TP.HCM',
		soTruong: 'PTIT',
		cauLacBoId: '5',
		lyDoDangKy: 'Yêu thích thể thao',
		trangThai: 'Approved',
		ghiChu: '',
		lichSu: [{ hanhDong: 'Approved', thoiGian: '2025-03-23T13:45:00', nguoiThucHien: 'Admin', lyDo: '' }],
		ngayDangKy: '2025-03-22',
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
	// CAU LAC BO ENDPOINTS
	'GET /api/cau-lac-bo/page': (req: Request, res: Response) => {
		const finalData = applyConditionAndFilters(cauLacBos, req);
		res.send({ data: paginate(finalData, req) });
	},
	'GET /api/cau-lac-bo/many': (_req: Request, res: Response) => {
		res.send({ data: cauLacBos });
	},
	'POST /api/cau-lac-bo': (req: Request, res: Response) => {
		const newItem = {
			...req.body,
			_id: Date.now().toString(),
			id: Date.now().toString(),
		};
		cauLacBos.push(newItem);
		res.send({ data: newItem });
	},
	'PUT /api/cau-lac-bo/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const index = cauLacBos.findIndex((i) => i.id === id || i._id === id);
		if (index !== -1) {
			cauLacBos[index] = { ...cauLacBos[index], ...req.body };
			res.send({ data: cauLacBos[index] });
		} else res.status(404).send({ message: 'Không tìm thấy' });
	},
	'DELETE /api/cau-lac-bo/:id': (req: Request, res: Response) => {
		cauLacBos = cauLacBos.filter((i) => i.id !== req.params.id && i._id !== req.params.id);
		res.send({ data: true });
	},

	// DON DANG KY ENDPOINTS
	'GET /api/don-dang-ky/page': (req: Request, res: Response) => {
		const finalData = applyConditionAndFilters(donDangKys, req);
		res.send({ data: paginate(finalData, req) });
	},
	'POST /api/don-dang-ky': (req: Request, res: Response) => {
		const newItem = {
			...req.body,
			_id: Date.now().toString(),
			id: Date.now().toString(),
			lichSu: [],
			ngayDangKy: new Date().toISOString().split('T')[0],
		};
		donDangKys.push(newItem);
		res.send({ data: newItem });
	},
	'PUT /api/don-dang-ky/duyet': (req: Request, res: Response) => {
		const { ids, hanhDong, lyDo } = req.body;
		ids.forEach((id: string) => {
			const index = donDangKys.findIndex((i) => i.id === id || i._id === id);
			if (index !== -1) {
				donDangKys[index].trangThai = hanhDong;
				donDangKys[index].lichSu.push({
					hanhDong,
					thoiGian: new Date().toISOString(),
					nguoiThucHien: 'Admin',
					lyDo: lyDo || '',
				});
				if (hanhDong === 'Rejected' && lyDo) {
					donDangKys[index].ghiChu = lyDo;
				}
			}
		});
		res.send({ data: true });
	},
	'PUT /api/don-dang-ky/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		const index = donDangKys.findIndex((i) => i.id === id || i._id === id);
		if (index !== -1) {
			donDangKys[index] = { ...donDangKys[index], ...req.body };
			res.send({ data: donDangKys[index] });
		} else res.status(404).send({ message: 'Không tìm thấy' });
	},
	'DELETE /api/don-dang-ky/:id': (req: Request, res: Response) => {
		donDangKys = donDangKys.filter((i) => i.id !== req.params.id && i._id !== req.params.id);
		res.send({ data: true });
	},
	'GET /api/don-dang-ky/:id/lich-su': (req: Request, res: Response) => {
		const { id } = req.params;
		const item = donDangKys.find((i) => i.id === id || i._id === id);
		if (item) {
			res.send({ data: item.lichSu });
		} else res.status(404).send({ message: 'Không tìm thấy' });
	},

	// THANH VIEN ENDPOINTS
	'GET /api/thanh-vien/page': (req: Request, res: Response) => {
		const cauLacBoId = req.query.cauLacBoId as string;
		let result = donDangKys.filter((d) => d.trangThai === 'Approved');
		if (cauLacBoId) {
			result = result.filter((d) => d.cauLacBoId === cauLacBoId);
		}
		const finalData = applyConditionAndFilters(result, req);
		res.send({ data: paginate(finalData, req) });
	},
	'PUT /api/thanh-vien/chuyen-clb': (req: Request, res: Response) => {
		const { ids, cauLacBoIdMoi } = req.body;
		ids.forEach((id: string) => {
			const index = donDangKys.findIndex((i) => i.id === id || i._id === id);
			if (index !== -1) {
				donDangKys[index].cauLacBoId = cauLacBoIdMoi;
			}
		});
		res.send({ data: true });
	},

	// THONG KE ENDPOINTS
	'GET /api/thong-ke/tong-quan': (_req: Request, res: Response) => {
		const soClb = cauLacBos.length;
		const soDonPending = donDangKys.filter((d) => d.trangThai === 'Pending').length;
		const soDonApproved = donDangKys.filter((d) => d.trangThai === 'Approved').length;
		const soDonRejected = donDangKys.filter((d) => d.trangThai === 'Rejected').length;
		res.send({
			data: {
				soClb,
				soDonPending,
				soDonApproved,
				soDonRejected,
			},
		});
	},
	'GET /api/thong-ke/don-theo-clb': (_req: Request, res: Response) => {
		const data = cauLacBos.map((clb) => {
			const pending = donDangKys.filter((d) => d.cauLacBoId === clb.id && d.trangThai === 'Pending').length;
			const approved = donDangKys.filter((d) => d.cauLacBoId === clb.id && d.trangThai === 'Approved').length;
			const rejected = donDangKys.filter((d) => d.cauLacBoId === clb.id && d.trangThai === 'Rejected').length;
			return {
				name: clb.tenCLB,
				pending,
				approved,
				rejected,
			};
		});
		res.send({ data });
	},
};
