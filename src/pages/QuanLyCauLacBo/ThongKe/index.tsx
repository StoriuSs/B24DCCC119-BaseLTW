import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Button, Select, message, Statistic, Spin } from 'antd';
import { useModel } from 'umi';
import Chart from 'react-apexcharts';
import * as XLSX from 'xlsx';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';
import { getThanhVienPage } from '@/services/QuanLyCauLacBo/thanhVien';
import { getDonTheoCauLacBo, getTongQuanThongKe } from '@/services/QuanLyCauLacBo/thongKe';

const ThongKePage: React.FC = () => {
	const { getAllModel: getAllCauLacBo } = useModel('quanlycaulacbo.cauLacBo');

	const [cauLacBoData, setCauLacBoData] = useState<CauLacBo[]>([]);
	const [tongQuanData, setTongQuanData] = useState<any>(null);
	const [donTheoCLB, setDonTheoCLB] = useState<any[]>([]);
	const [selectedCauLacBoId, setSelectedCauLacBoId] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchData = async () => {
			setLoading(true);
			try {
				const [tongQuan, donCLB, clb] = await Promise.all([
					getTongQuanThongKe(),
					getDonTheoCauLacBo(),
					getAllCauLacBo(false, undefined, undefined, undefined, 'many', false),
				]);
				setTongQuanData(tongQuan?.data?.data);
				setDonTheoCLB(donCLB?.data?.data || []);
				setCauLacBoData(clb || []);
			} catch (error) {
				message.error('Lỗi tải dữ liệu thống kê');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [getAllCauLacBo]);

	const handleXuatThanhVien = async () => {
		if (!selectedCauLacBoId) {
			message.error('Vui lòng chọn câu lạc bộ');
			return;
		}

		try {
			const response = await getThanhVienPage({ cauLacBoId: selectedCauLacBoId, page: 1, limit: 1000 });

			const clb = cauLacBoData.find((c) => c.id === selectedCauLacBoId);
			const fileName = `ThanhVien_${clb?.tenCLB}.xlsx`;

			const data = (response?.data?.data?.result || []).map((item: any) => ({
				'Họ tên': item.hoTen,
				Email: item.email,
				SĐT: item.sdt,
				'Giới tính': item.gioiTinh,
				'Địa chỉ': item.diaChi,
				'Sở trường': item.soTruong,
				'Ngày đăng ký': item.ngayDangKy,
			}));

			const ws = XLSX.utils.json_to_sheet(data);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
			XLSX.writeFile(wb, fileName);

			message.success('Xuất file thành công');
		} catch (error) {
			message.error('Lỗi xuất file');
		}
	};

	if (loading || !tongQuanData) {
		return <Spin />;
	}

	// Prepare chart data
	const chartOptions = {
		chart: {
			type: 'bar',
			stacked: false,
		},
		xaxis: {
			categories: donTheoCLB.map((item) => item.name),
		},
		yaxis: {
			title: {
				text: 'Số đơn đăng ký',
			},
		},
		colors: ['#faad14', '#52c41a', '#ff4d4f'],
	};

	const chartSeries = [
		{
			name: 'Pending',
			data: donTheoCLB.map((item) => item.pending),
		},
		{
			name: 'Approved',
			data: donTheoCLB.map((item) => item.approved),
		},
		{
			name: 'Rejected',
			data: donTheoCLB.map((item) => item.rejected),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<h2 style={{ marginBottom: '24px' }}>Báo cáo và thống kê</h2>

			{/* Phần 1: Cards thống kê */}
			<Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Tổng số CLB' value={tongQuanData?.soClb} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Đơn Pending' value={tongQuanData?.soDonPending} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Đơn Approved' value={tongQuanData?.soDonApproved} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Đơn Rejected' value={tongQuanData?.soDonRejected} valueStyle={{ color: '#ff4d4f' }} />
					</Card>
				</Col>
			</Row>

			{/* Phần 2: ColumnChart */}
			<Card style={{ marginBottom: '32px' }}>
				<h3 style={{ marginBottom: '16px' }}>Đơn đăng ký theo từng CLB</h3>
				<Chart options={chartOptions as any} series={chartSeries} type='bar' height={350} />
			</Card>

			{/* Phần 3: Xuất XLSX */}
			<Card>
				<h3 style={{ marginBottom: '16px' }}>Xuất danh sách thành viên</h3>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={8}>
						<Select
							style={{ width: '100%' }}
							placeholder='Chọn câu lạc bộ'
							value={selectedCauLacBoId || undefined}
							onChange={(value) => setSelectedCauLacBoId(value)}
						>
							{cauLacBoData.map((clb) => (
								<Select.Option key={clb.id} value={clb.id}>
									{clb.tenCLB}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col xs={24} sm={12} md={4}>
						<Button type='primary' onClick={handleXuatThanhVien} block>
							Xuất XLSX
						</Button>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default ThongKePage;
