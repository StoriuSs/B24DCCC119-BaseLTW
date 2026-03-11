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
