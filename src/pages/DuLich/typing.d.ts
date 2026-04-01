export interface DiemDen {
	_id?: string;
	id: string;
	ten: string;
	diaDiem: string;
	loaiHinh: 'Bien' | 'Nui' | 'Thanh pho';
	rating: number;
	giaTrungBinh: number;
	thoiGianThamQuanGio: number;
	chiPhiAnUong: number;
	chiPhiLuuTru: number;
	chiPhiDiChuyen: number;
	moTa: string;
	hinhAnh?: string;
	noiBat?: boolean;
}

export interface MucLichTrinh {
	_id?: string;
	id: string;
	ngay: number;
	diemDenId: string;
	thuTu: number;
	thoiGianDiChuyenGio: number;
	ghiChu?: string;
}

export interface NganSachDuLich {
	nganSachToiDa: number;
	anUong: number;
	diChuyen: number;
	luuTru: number;
	thamQuan: number;
	tenCauHinhPhanBo?: string;
}

export interface NguonNganSach {
	_id?: string;
	id: string;
	tenNguon: string;
	loaiNguon: 'Thu nhap' | 'Tiet kiem' | 'Dau tu' | 'Khac';
	soTien: number;
	ghiChu?: string;
}

export interface CauHinhPhanBoChiTieu {
	_id?: string;
	id: string;
	tenCauHinh: string;
	anUongPct: number;
	diChuyenPct: number;
	luuTruPct: number;
	thamQuanPct: number;
	macDinh?: boolean;
}

export interface ThongKeAdmin {
	tongLichTrinhTheoThang: { thang: string; soLuong: number }[];
	diaDiemPhoBien: { ten: string; luotChon: number }[];
	tongDoanhThu: number;
	doanhThuTheoHangMuc: NganSachDuLich;
}
