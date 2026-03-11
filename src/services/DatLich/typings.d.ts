declare module DatLich {
	type TrangThaiLichHen = 'CHO_DUYET' | 'XAC_NHAN' | 'HOAN_THANH' | 'HUY';

	interface LichLamViec {
		thu: number;
		gioBatDau: string;
		gioKetThuc: string;
	}

	interface NhanVien {
		_id: string;
		maNhanVien: string;
		tenNhanVien: string;
		soKhachToiDaMoiNgay: number;
		lichLamViec: LichLamViec[];
		trangThai: 'ACTIVE' | 'INACTIVE';
	}

	interface DichVu {
		_id: string;
		maDichVu: string;
		tenDichVu: string;
		gia: number;
		thoiLuongPhut: number;
		moTa?: string;
		trangThai: 'ACTIVE' | 'INACTIVE';
	}

	interface LichHen {
		_id: string;
		maLichHen: string;
		tenKhachHang: string;
		soDienThoai: string;
		ngayHen: string;
		gioBatDau: string;
		gioKetThuc: string;
		nhanVienId: string;
		dichVuId: string;
		tongTien: number;
		trangThai: TrangThaiLichHen;
		ghiChu?: string;
		createdAt: string;
	}

	interface DanhGia {
		_id: string;
		lichHenId: string;
		nhanVienId: string;
		dichVuId: string;
		diem: number;
		noiDung: string;
		phanHoiNhanVien?: string;
		thoiGianDanhGia: string;
	}
}
