export interface CauLacBo {
	_id?: string;
	id: string;
	anhDaiDien?: string; // URL ảnh
	tenCLB: string;
	ngayThanhLap: string; // ISO date
	moTa: string; // HTML content (TinyEditor)
	chuNhiem: string; // Text
	hoatDong: boolean; // true/false
}

export interface DonDangKy {
	_id?: string;
	id: string;
	hoTen: string;
	email: string;
	sdt: string;
	gioiTinh: 'Nam' | 'Nữ' | 'Khác';
	diaChi: string;
	soTruong: string;
	cauLacBoId: string; // FK → CauLacBo
	lyDoDangKy: string;
	trangThai: 'Pending' | 'Approved' | 'Rejected';
	ghiChu?: string; // Lý do từ chối
	lichSu: LichSuThaoTac[]; // Lịch sử duyệt/từ chối
	ngayDangKy: string;
}

export interface LichSuThaoTac {
	hanhDong: 'Approved' | 'Rejected';
	thoiGian: string; // ISO datetime
	nguoiThucHien: string; // "Admin"
	lyDo?: string; // Lý do từ chối
}

export interface ThanhVien extends Omit<DonDangKy, 'trangThai' | 'lichSu'> {
	// Thành viên = đơn đăng ký đã Approved
}
