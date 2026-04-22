import { RoomInput, RoomType } from './typing';

export const ROOM_STORAGE_KEY = 'quan_ly_phong_hoc_data';

export const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
	{ value: 'LY_THUYET', label: 'Lý thuyết' },
	{ value: 'THUC_HANH', label: 'Thực hành' },
	{ value: 'HOI_TRUONG', label: 'Hội trường' },
];

export const RESPONSIBLE_TEACHERS: string[] = ['Thầy Nguyễn Văn An', 'Cô Trần Thu Hà', 'Thầy Lê Quang Minh'];

export const DEFAULT_ROOMS: RoomInput[] = [
	{
		maPhong: 'A101',
		tenPhong: 'Phòng học A101',
		soChoNgoi: 40,
		loaiPhong: 'LY_THUYET',
		nguoiPhuTrach: 'Thầy Nguyễn Văn An',
	},
	{
		maPhong: 'B205',
		tenPhong: 'Phòng thực hành B205',
		soChoNgoi: 28,
		loaiPhong: 'THUC_HANH',
		nguoiPhuTrach: 'Cô Trần Thu Hà',
	},
	{
		maPhong: 'HT01',
		tenPhong: 'Hội trường lớn',
		soChoNgoi: 180,
		loaiPhong: 'HOI_TRUONG',
		nguoiPhuTrach: 'Thầy Lê Quang Minh',
	},
];
