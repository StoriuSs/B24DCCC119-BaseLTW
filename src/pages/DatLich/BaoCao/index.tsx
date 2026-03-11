import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { Col, Row, Statistic, Card as ACard } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const BaoCaoPage = () => {
	const { lichTheoNgay, lichTheoThang, doanhThuTheoDichVu, doanhThuTheoNhanVien, getData } = useModel('datlich.baocao');

	useEffect(() => {
		getData();
	}, []);

	const tongLich = lichTheoThang.values.reduce((s, v) => s + v, 0);
	const tongDoanhThu = doanhThuTheoDichVu.values.reduce((s, v) => s + v, 0);

	return (
		<Row gutter={[16, 16]}>
			<Col span={12}>
				<ACard>
					<Statistic title='Tổng số lịch hẹn' value={tongLich} />
				</ACard>
			</Col>
			<Col span={12}>
				<ACard>
					<Statistic
						title='Tổng doanh thu (lịch hoàn thành)'
						value={new Intl.NumberFormat('vi-VN').format(tongDoanhThu)}
						suffix='VND'
					/>
				</ACard>
			</Col>

			<Col span={24}>
				<ACard title='Số lượng lịch hẹn theo tháng'>
					<ColumnChart
						xAxis={lichTheoThang.labels}
						yAxis={[lichTheoThang.values]}
						yLabel={['Số lịch']}
						formatY={(val) => `${val} lịch`}
					/>
				</ACard>
			</Col>

			<Col span={24}>
				<ACard title='Số lượng lịch hẹn trong tháng này theo ngày'>
					<ColumnChart
						xAxis={lichTheoNgay.labels}
						yAxis={[lichTheoNgay.values]}
						yLabel={['Số lịch']}
						formatY={(val) => `${val} lịch`}
					/>
				</ACard>
			</Col>

			<Col span={12}>
				<ACard title='Doanh thu theo dịch vụ'>
					{doanhThuTheoDichVu.labels.length > 0 ? (
						<DonutChart
							xAxis={doanhThuTheoDichVu.labels}
							yAxis={[doanhThuTheoDichVu.values]}
							yLabel={['Doanh thu']}
							formatY={(val) => `${new Intl.NumberFormat('vi-VN').format(val)} VND`}
							showTotal
						/>
					) : (
						<p>Chưa có dữ liệu</p>
					)}
				</ACard>
			</Col>

			<Col span={12}>
				<ACard title='Doanh thu theo nhân viên'>
					{doanhThuTheoNhanVien.labels.length > 0 ? (
						<DonutChart
							xAxis={doanhThuTheoNhanVien.labels}
							yAxis={[doanhThuTheoNhanVien.values]}
							yLabel={['Doanh thu']}
							formatY={(val) => `${new Intl.NumberFormat('vi-VN').format(val)} VND`}
							showTotal
						/>
					) : (
						<p>Chưa có dữ liệu</p>
					)}
				</ACard>
			</Col>
		</Row>
	);
};

export default BaoCaoPage;
