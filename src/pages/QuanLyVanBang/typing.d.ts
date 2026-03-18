export interface SoVanBang {
	_id?: string;
	id: string;
	tenSo: string;
	nam: string;
	soVaoSoHienTai: number;
}

export interface QuyetDinhTotNghiep {
	_id?: string;
	id: string;
	soSQ: string;
	ngayBanHanh: string;
	trichYeu: string;
	soVanBangId: string;
	soLuotTraCuu: number;
}

export interface CauHinhBieuMau {
	_id?: string;
	id: string;
	maTruong: string;
	tenTruong: string;
	kieuDuLieu: 'String' | 'Number' | 'Date';
}
export interface ThongTinVanBang {
	_id?: string;
	id: string;
	soVaoSo: number;
	soHieuVanBang: string;
	maSinhVien: string;
	hoTen: string;
	ngaySinh: string;
	quyetDinhId: string;
	extraFields: Record<string, any>;
}
