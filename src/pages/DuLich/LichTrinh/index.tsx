import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Input, InputNumber, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { DiemDen, MucLichTrinh } from '@/pages/DuLich/typing';
import { formatVND } from '@/pages/DuLich/utils';

const { Title, Text } = Typography;

const LichTrinhPage: React.FC = () => {
	const { getAllModel: getAllDiemDen } = useModel('dulich.diemDen');
	const { getAllModel: getAllLichTrinh, postModel, deleteModel, putModel } = useModel('dulich.lichTrinh');

	const [dsDiemDen, setDsDiemDen] = useState<DiemDen[]>([]);
	const [mucLichTrinh, setMucLichTrinh] = useState<MucLichTrinh[]>([]);
	const [ngay, setNgay] = useState<number>(1);
	const [diemDenId, setDiemDenId] = useState<string>('');
	const [thoiGianDiChuyenGio, setThoiGianDiChuyenGio] = useState<number>(1);
	const [ghiChu, setGhiChu] = useState<string>('');

	const loadData = async () => {
		const [dd, lt] = await Promise.all([
			getAllDiemDen(false, undefined, undefined, undefined, 'many', false),
			getAllLichTrinh(false, undefined, undefined, undefined, 'many', false),
		]);
		setDsDiemDen(dd || []);
		setMucLichTrinh((lt || []).sort((a, b) => a.ngay - b.ngay || a.thuTu - b.thuTu));
	};

	useEffect(() => {
		loadData();
	}, []);

	const diemDenMap = useMemo(() => Object.fromEntries(dsDiemDen.map((x) => [x.id, x])), [dsDiemDen]);

	const tongChiPhi = useMemo(() => {
		return mucLichTrinh.reduce((sum, item) => {
			const dd = diemDenMap[item.diemDenId];
			if (!dd) return sum;
			return sum + dd.chiPhiAnUong + dd.chiPhiLuuTru + dd.chiPhiDiChuyen;
		}, 0);
	}, [diemDenMap, mucLichTrinh]);

	const tongThoiGian = useMemo(() => {
		return mucLichTrinh.reduce((sum, item) => {
			const dd = diemDenMap[item.diemDenId];
			return sum + (dd?.thoiGianThamQuanGio || 0) + item.thoiGianDiChuyenGio;
		}, 0);
	}, [diemDenMap, mucLichTrinh]);

	const handleAdd = async () => {
		if (!diemDenId) {
			message.error('Vui lòng chọn điểm đến');
			return;
		}
		const thuTu = mucLichTrinh.filter((x) => x.ngay === ngay).length + 1;
		await postModel({ ngay, diemDenId, thuTu, thoiGianDiChuyenGio, ghiChu } as any);
		setDiemDenId('');
		setThoiGianDiChuyenGio(1);
		setGhiChu('');
		await loadData();
	};

	const moveOrder = async (record: MucLichTrinh, direction: 'up' | 'down') => {
		const sameDay = mucLichTrinh.filter((x) => x.ngay === record.ngay).sort((a, b) => a.thuTu - b.thuTu);
		const idx = sameDay.findIndex((x) => x.id === record.id);
		const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
		if (targetIdx < 0 || targetIdx >= sameDay.length) return;
		const target = sameDay[targetIdx];
		await Promise.all([
			putModel(record._id || record.id, { thuTu: target.thuTu } as any),
			putModel(target._id || target.id, { thuTu: record.thuTu } as any),
		]);
		await loadData();
	};

	return (
		<div style={{ padding: 24 }}>
			<Title level={3}>Tạo lịch trình du lịch</Title>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} md={4}>
					<InputNumber min={1} value={ngay} onChange={(v) => setNgay(v || 1)} style={{ width: '100%' }} addonBefore='Ngày' />
				</Col>
				<Col xs={24} md={6}>
					<Select placeholder='Chọn điểm đến' value={diemDenId || undefined} onChange={setDiemDenId} style={{ width: '100%' }}>
						{dsDiemDen.map((item) => (
							<Select.Option key={item.id} value={item.id}>{item.ten}</Select.Option>
						))}
					</Select>
				</Col>
				<Col xs={24} md={4}>
					<InputNumber
						min={0.5}
						step={0.5}
						value={thoiGianDiChuyenGio}
						onChange={(v) => setThoiGianDiChuyenGio(v || 1)}
						style={{ width: '100%' }}
						addonBefore='Di chuyển'
					/>
				</Col>
				<Col xs={24} md={7}>
					<Input placeholder='Ghi chú' value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
				</Col>
				<Col xs={24} md={3}>
					<Button type='primary' icon={<PlusOutlined />} block onClick={handleAdd}>Thêm</Button>
				</Col>
			</Row>

			<Card style={{ marginBottom: 16 }}>
				<Space size={24} wrap>
					<Text>Tổng điểm đến: <Tag color='blue'>{mucLichTrinh.length}</Tag></Text>
					<Text>Tổng ngân sách ước tính: <Tag color='gold'>{formatVND(tongChiPhi)}</Tag></Text>
					<Text>Tổng thời gian: <Tag color='purple'>{tongThoiGian} giờ</Tag></Text>
				</Space>
			</Card>

			<Alert
				type='info'
				showIcon
				message='Bạn có thể sắp xếp thứ tự điểm đến theo ngày bằng nút mũi tên lên/xuống.'
				style={{ marginBottom: 16 }}
			/>

			<Table
				rowKey={(row) => row._id || row.id}
				dataSource={mucLichTrinh}
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1100 }}
				columns={[
					{ title: 'Ngày', dataIndex: 'ngay', width: 90, sorter: (a, b) => a.ngay - b.ngay },
					{ title: 'Thứ tự', dataIndex: 'thuTu', width: 90 },
					{ title: 'Điểm đến', dataIndex: 'diemDenId', render: (id) => diemDenMap[id]?.ten || id },
					{ title: 'Địa điểm', dataIndex: 'diemDenId', render: (id) => diemDenMap[id]?.diaDiem || '-' },
					{ title: 'Thời gian di chuyển (giờ)', dataIndex: 'thoiGianDiChuyenGio', width: 180 },
					{ title: 'Ghi chú', dataIndex: 'ghiChu', render: (v) => v || '-' },
					{
						title: 'Thao tác',
						width: 200,
						render: (_, record) => (
							<Space>
								<Button icon={<ArrowUpOutlined />} onClick={() => moveOrder(record, 'up')} />
								<Button icon={<ArrowDownOutlined />} onClick={() => moveOrder(record, 'down')} />
								<Button danger icon={<DeleteOutlined />} onClick={() => deleteModel(record._id || record.id).then(loadData)} />
							</Space>
						),
					},
				]}
			/>
		</div>
	);
};

export default LichTrinhPage;
