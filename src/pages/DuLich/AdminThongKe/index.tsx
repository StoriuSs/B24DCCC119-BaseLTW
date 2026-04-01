import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import Chart from 'react-apexcharts';
import { ThongKeAdmin } from '@/pages/DuLich/typing';
import { getThongKeAdminDuLich } from '@/services/DuLich/nganSach';
import { statisticVNDFormatter } from '@/pages/DuLich/utils';

const { Title } = Typography;

const AdminThongKePage: React.FC = () => {
	const [thongKe, setThongKe] = useState<ThongKeAdmin | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchThongKe = async () => {
			setLoading(true);
			try {
				const res = await getThongKeAdminDuLich();
				setThongKe(res?.data?.data || null);
			} finally {
				setLoading(false);
			}
		};

		fetchThongKe();
	}, []);

	const tongTheoThang = useMemo(
		() => thongKe?.tongLichTrinhTheoThang.reduce((sum, item) => sum + item.soLuong, 0) || 0,
		[thongKe],
	);

	if (loading || !thongKe) return <Spin />;

	const doanhThuTheoHangMuc = thongKe.doanhThuTheoHangMuc;
	const tongDoanhThuTheoHangMuc =
		doanhThuTheoHangMuc.anUong +
		doanhThuTheoHangMuc.diChuyen +
		doanhThuTheoHangMuc.luuTru +
		doanhThuTheoHangMuc.thamQuan;

	return (
		<div style={{ padding: 24 }}>
			<Title level={3}>Admin - Thống kê du lịch</Title>

			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Tổng lịch trình theo tháng' value={tongTheoThang} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Tổng doanh thu' value={thongKe.tongDoanhThu} formatter={statisticVNDFormatter} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic
							title='Doanh thu theo hạng mục'
							value={tongDoanhThuTheoHangMuc}
							formatter={statisticVNDFormatter}
						/>
					</Card>
				</Col>
			</Row>

			{tongDoanhThuTheoHangMuc > thongKe.tongDoanhThu && (
				<Alert
					type='warning'
					showIcon
					message='Dữ liệu thống kê có sai lệch giữa tổng doanh thu và doanh thu theo hạng mục.'
					style={{ marginBottom: 16 }}
				/>
			)}

			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Lịch trình theo tháng'>
						<Chart
							type='bar'
							height={300}
							series={[{ name: 'Số lượng', data: thongKe.tongLichTrinhTheoThang.map((x) => x.soLuong) }]}
							options={{
								xaxis: { categories: thongKe.tongLichTrinhTheoThang.map((x) => `Tháng ${x.thang}`) },
								dataLabels: { enabled: false },
							}}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Địa điểm phổ biến'>
						<Chart
							type='bar'
							height={300}
							series={[{ name: 'Lượt chọn', data: thongKe.diaDiemPhoBien.map((x) => x.luotChon) }]}
							options={{
								plotOptions: { bar: { horizontal: true } },
								xaxis: { categories: thongKe.diaDiemPhoBien.map((x) => x.ten) },
								dataLabels: { enabled: false },
							}}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Cơ cấu doanh thu theo hạng mục'>
				<Chart
					type='pie'
					height={320}
					series={[
						thongKe.doanhThuTheoHangMuc.anUong,
						thongKe.doanhThuTheoHangMuc.diChuyen,
						thongKe.doanhThuTheoHangMuc.luuTru,
						thongKe.doanhThuTheoHangMuc.thamQuan,
					]}
					options={{ labels: ['Ăn uống', 'Di chuyển', 'Lưu trú', 'Tham quan'], legend: { position: 'bottom' } }}
				/>
			</Card>
		</div>
	);
};

export default AdminThongKePage;
