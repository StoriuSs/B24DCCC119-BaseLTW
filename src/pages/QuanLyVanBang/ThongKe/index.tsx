import React, { useEffect } from 'react';
import { Card, Empty } from 'antd';
import { useModel } from 'umi';
import Chart from 'react-apexcharts';

const ThongKePage: React.FC = () => {
	const quyetDinhStoreModel = useModel('quanlyvanbang.quyetDinh');

	useEffect(() => {
		quyetDinhStoreModel.getAllModel();
	}, []);

	const chartData = quyetDinhStoreModel.danhSach.map((item: any) => ({
		soSQ: item.soSQ,
		counts: item.soLuotTraCuu || 0,
	}));

	if (chartData.length === 0) {
		return (
			<div style={{ padding: 24, background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 50%)', borderRadius: 12 }}>
				<Card title='Thống kê số lượt tra cứu theo Quyết định tốt nghiệp' style={{ borderRadius: 12 }}>
					<Empty description='Chưa có dữ liệu quyết định tốt nghiệp' />
				</Card>
			</div>
		);
	}

	const chartOptions = {
		chart: { id: 'search-counts-bar', toolbar: { show: false } },
		colors: ['#1d39c4'],
		dataLabels: { enabled: false },
		plotOptions: { bar: { borderRadius: 4, columnWidth: '48%' } },
		grid: { borderColor: '#f0f0f0' },
		xaxis: {
			categories: chartData.map((item: any) => item.soSQ),
			title: { text: 'Quyết định' },
		},
		yaxis: { title: { text: 'Lượt tra cứu' } },
		title: {
			text: 'Thống kê số lượt tra cứu theo Quyết định tốt nghiệp',
			align: 'center' as const,
		},
	};

	const chartSeries = [
		{
			name: 'Lượt tra cứu',
			data: chartData.map((item: any) => item.counts),
		},
	];

	return (
		<div style={{ padding: 24, background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 50%)', borderRadius: 12 }}>
			<Card
				style={{ borderRadius: 12 }}
				title='Biểu đồ lượt tra cứu theo quyết định'
				extra={<span style={{ color: '#8c8c8c' }}>Tổng quyết định: {chartData.length}</span>}
			>
				<Chart options={chartOptions} series={chartSeries} type='bar' width='100%' height='400' />
			</Card>
		</div>
	);
};

export default ThongKePage;
