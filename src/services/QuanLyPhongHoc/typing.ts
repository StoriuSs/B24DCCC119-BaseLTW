export type RoomType = 'LY_THUYET' | 'THUC_HANH' | 'HOI_TRUONG';

export type SeatSortOrder = 'ascend' | 'descend';

export interface Room {
	id: string;
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: RoomType;
	nguoiPhuTrach: string;
	createdAt: string;
	updatedAt?: string;
}

export interface RoomInput {
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: RoomType;
	nguoiPhuTrach: string;
}

export interface RoomFilters {
	keyword?: string;
	loaiPhong?: RoomType;
	nguoiPhuTrach?: string;
	maPhong?: string;
	tenPhong?: string;
	minSeats?: number;
	maxSeats?: number;
}
