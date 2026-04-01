import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Empty, InputNumber, Rate, Row, Select, Space, Typography } from 'antd';
import { useModel } from 'umi';
import { DiemDen } from '@/pages/DuLich/typing';
import { formatVND } from '@/pages/DuLich/utils';

const { Title, Text } = Typography;

const KhamPhaPage: React.FC = () => {
	const { getAllModel: getAllDiemDen } = useModel('dulich.diemDen');
	const [data, setData] = useState<DiemDen[]>([]);
	const [loai, setLoai] = useState<string | undefined>();
	const [sortBy, setSortBy] = useState<string>('rating');
	const [minGia, setMinGia] = useState<number | undefined>();
	const [minRating, setMinRating] = useState<number>(0);

	useEffect(() => {
		const fetchData = async () => {
			const rows = await getAllDiemDen(false, undefined, undefined, undefined, 'many', false);
			setData(rows || []);
		};
		fetchData();
	}, [getAllDiemDen]);

	const filtered = useMemo(() => {
		let rows = [...data];
		if (loai) rows = rows.filter((x) => x.loaiHinh === loai);
		if (minGia !== undefined) rows = rows.filter((x) => x.giaTrungBinh >= minGia);
		if (minRating > 0) rows = rows.filter((x) => x.rating >= minRating);

		if (sortBy === 'rating') rows.sort((a, b) => b.rating - a.rating);
		if (sortBy === 'gia') rows.sort((a, b) => a.giaTrungBinh - b.giaTrungBinh);
		if (sortBy === 'ten') rows.sort((a, b) => a.ten.localeCompare(b.ten, 'vi'));
		return rows;
	}, [data, loai, minGia, minRating, sortBy]);

	return (
		<div style={{ padding: 24 }}>
			<Title level={3}>Trang chủ - Khám phá điểm đến</Title>
			<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
				<Col xs={24} sm={12} lg={6}>
					<Select allowClear placeholder='Loại hình' style={{ width: '100%' }} value={loai} onChange={setLoai}>
						<Select.Option value='Bien'>Biển</Select.Option>
						<Select.Option value='Nui'>Núi</Select.Option>
						<Select.Option value='Thanh pho'>Thành phố</Select.Option>
					</Select>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Select style={{ width: '100%' }} value={sortBy} onChange={setSortBy}>
						<Select.Option value='rating'>Sắp xếp theo rating</Select.Option>
						<Select.Option value='gia'>Sắp xếp theo giá tăng dần</Select.Option>
						<Select.Option value='ten'>Sắp xếp theo tên</Select.Option>
					</Select>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<InputNumber
						placeholder='Giá tối thiểu'
						style={{ width: '100%' }}
						value={minGia}
						onChange={(v) => setMinGia(v ?? undefined)}
					/>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Space wrap>
						<Text>Rating từ:</Text>
						<Rate allowHalf value={minRating} onChange={setMinRating} />
					</Space>
				</Col>
			</Row>

			{filtered.length === 0 ? (
				<Empty description='Không có điểm đến phù hợp' />
			) : (
				<Row gutter={[16, 16]}>
					{filtered.map((item) => (
						<Col xs={24} sm={12} md={8} lg={6} key={item.id}>
							<Card
								hoverable
								cover={
									<img
										alt={item.ten}
										src={item.hinhAnh || 'https://via.placeholder.com/500x300?text=Destination'}
										style={{ height: 180, objectFit: 'cover' }}
									/>
								}
							>
								<Card.Meta title={item.ten} description={`${item.diaDiem} - ${item.loaiHinh}`} />
								<div style={{ marginTop: 8 }}>
									<Rate disabled allowHalf value={item.rating} />
									<div>Giá TB: {formatVND(item.giaTrungBinh)}</div>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</div>
	);
};

export default KhamPhaPage;
