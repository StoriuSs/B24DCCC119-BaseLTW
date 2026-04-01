export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/guess-number',
		name: 'GuessNumber',
		component: './GuessNumber',
		icon: 'TrophyOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		component: './TodoList',
		icon: 'UnorderedListOutlined',
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	// DAT LICH DICH VU
	{
		name: 'DatLichDichVu',
		path: '/dat-lich-dich-vu',
		icon: 'CalendarOutlined',
		routes: [
			{
				name: 'QuanLy',
				path: '/dat-lich-dich-vu/quan-ly',
				routes: [
					{
						name: 'NhanVien',
						path: '/dat-lich-dich-vu/quan-ly/nhan-vien',
						component: './DatLich/NhanVien',
					},
					{
						name: 'DichVu',
						path: '/dat-lich-dich-vu/quan-ly/dich-vu',
						component: './DatLich/DichVu',
					},
					{
						name: 'LichHen',
						path: '/dat-lich-dich-vu/quan-ly/lich-hen',
						component: './DatLich/QuanLy/LichHen',
					},
				],
			},
			{
				name: 'LichHen',
				path: '/dat-lich-dich-vu/lich-hen',
				routes: [
					{
						name: 'DanhSach',
						path: '/dat-lich-dich-vu/lich-hen/danh-sach',
						component: './DatLich/LichHen/DanhSach',
					},
					{
						name: 'DatLich',
						path: '/dat-lich-dich-vu/lich-hen/dat-lich',
						component: './DatLich/LichHen/DatLich',
						hideInMenu: true,
					},
				],
			},
			{
				name: 'DanhGia',
				path: '/dat-lich-dich-vu/danh-gia',
				component: './DatLich/DanhGia',
			},
			{
				name: 'BaoCao',
				path: '/dat-lich-dich-vu/bao-cao',
				component: './DatLich/BaoCao',
			},
		],
	},
	// QUẢN LÝ VĂN BẰNG
	{
		path: '/quan-ly-van-bang',
		name: 'Quản lý văn bằng',
		icon: 'BookOutlined',
		routes: [
			{
				name: 'Sổ văn bằng',
				path: '/quan-ly-van-bang/so-van-bang',
				component: './QuanLyVanBang/SoVanBang',
			},
			{
				name: 'Quyết định tốt nghiệp',
				path: '/quan-ly-van-bang/quyet-dinh',
				component: './QuanLyVanBang/QuyetDinh',
			},
			{
				name: 'Cấu hình biểu mẫu',
				path: '/quan-ly-van-bang/cau-hinh',
				component: './QuanLyVanBang/CauHinh',
			},
			{
				name: 'Thông tin văn bằng',
				path: '/quan-ly-van-bang/thong-tin',
				component: './QuanLyVanBang/ThongTin',
			},
			{
				name: 'Tra cứu văn bằng',
				path: '/quan-ly-van-bang/tra-cuu',
				component: './QuanLyVanBang/TraCuu',
			},
			{
				name: 'Thống kê',
				path: '/quan-ly-van-bang/thong-ke',
				component: './QuanLyVanBang/ThongKe',
			},
		],
	},
	// QUẢN LÝ CÂU LẠC BỘ
	{
		path: '/quan-ly-cau-lac-bo',
		name: 'Quản lý CLB',
		icon: 'TeamOutlined',
		routes: [
			{
				name: 'Danh sách CLB',
				path: '/quan-ly-cau-lac-bo/danh-sach',
				component: './QuanLyCauLacBo/DanhSachCLB',
			},
			{
				name: 'Đơn đăng ký',
				path: '/quan-ly-cau-lac-bo/don-dang-ky',
				component: './QuanLyCauLacBo/DonDangKy',
			},
			{
				name: 'Quản lý thành viên',
				path: '/quan-ly-cau-lac-bo/thanh-vien',
				component: './QuanLyCauLacBo/ThanhVien',
			},
			{
				name: 'Thống kê',
				path: '/quan-ly-cau-lac-bo/thong-ke',
				component: './QuanLyCauLacBo/ThongKe',
			},
		],
	},
	// ỨNG DỤNG DU LỊCH
	{
		path: '/du-lich',
		name: 'Du lịch',
		icon: 'CompassOutlined',
		routes: [
			{
				name: 'Khám phá điểm đến',
				path: '/du-lich/kham-pha',
				component: './DuLich/KhamPha',
			},
			{
				name: 'Tạo lịch trình',
				path: '/du-lich/lich-trinh',
				component: './DuLich/LichTrinh',
			},
			{
				name: 'Quản lý ngân sách',
				path: '/du-lich/ngan-sach',
				component: './DuLich/NganSach',
			},
			{
				name: 'Admin - Quản lý điểm đến',
				path: '/du-lich/admin-diem-den',
				component: './DuLich/AdminDiemDen',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
