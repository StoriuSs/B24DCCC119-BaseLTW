import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, InputNumber, Row, Select, Spin, Statistic, Switch, Tabs, Typography, message } from 'antd';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { getTongQuanNganSach } from '@/services/DuLich/nganSach';
import { CauHinhPhanBoChiTieu, NganSachDuLich, NguonNganSach } from '@/pages/DuLich/typing';
import { formatVND, statisticVNDFormatter } from '@/pages/DuLich/utils';

const { Title } = Typography;

const FormNguonNganSach: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('dulich.nganSach');
	const [form] = Form.useForm();

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
			form.setFieldsValue({ loaiNguon: 'Thu nhap' });
		}
	}, [edit, form, record]);

	const handleSubmit = async (values: NguonNganSach) => {
		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='tenNguon' label='Tên nguồn ngân sách' rules={[{ required: true, message: 'Vui lòng nhập tên nguồn' }]}>
				<Input placeholder='Ví dụ: Lương tháng 4' />
			</Form.Item>
			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Form.Item name='loaiNguon' label='Loại nguồn' rules={[{ required: true, message: 'Vui lòng chọn loại nguồn' }]}>
						<Select>
							<Select.Option value='Thu nhap'>Thu nhập</Select.Option>
							<Select.Option value='Tiet kiem'>Tiết kiệm</Select.Option>
							<Select.Option value='Dau tu'>Đầu tư</Select.Option>
							<Select.Option value='Khac'>Khác</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='soTien' label='Số tiền (VND)' rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name='ghiChu' label='Ghi chú'>
				<Input.TextArea rows={3} />
			</Form.Item>
			<div style={{ textAlign: 'right' }}>
				<Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>
					Hủy
				</Button>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{edit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</div>
		</Form>
	);
};

const QuanLyNguonNganSach: React.FC = () => {
	const columns: IColumn<NguonNganSach>[] = [
		{ title: 'Tên nguồn', dataIndex: 'tenNguon', width: 220, filterType: 'string', sortable: true },
		{ title: 'Loại nguồn', dataIndex: 'loaiNguon', width: 160, filterType: 'select', filterData: ['Thu nhap', 'Tiet kiem', 'Dau tu', 'Khac'] },
		{ title: 'Số tiền', dataIndex: 'soTien', width: 180, sortable: true, render: (v: number) => formatVND(v) },
		{ title: 'Ghi chú', dataIndex: 'ghiChu', width: 280 },
	];

	return (
		<TableBase
			title=''
			modelName='dulich.nganSach'
			columns={columns}
			Form={FormNguonNganSach}
			formType='Drawer'
			widthDrawer={720}
		/>
	);
};

const FormPhanBoChiTieu: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('dulich.phanBoChiTieu');
	const [form] = Form.useForm();

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
			form.setFieldsValue({ tenCauHinh: 'Cấu hình mới', anUongPct: 25, diChuyenPct: 25, luuTruPct: 35, thamQuanPct: 15, macDinh: false });
		}
	}, [edit, form, record]);

	const handleSubmit = async (values: CauHinhPhanBoChiTieu) => {
		const tong = Number(values.anUongPct || 0) + Number(values.diChuyenPct || 0) + Number(values.luuTruPct || 0) + Number(values.thamQuanPct || 0);
		if (tong !== 100) {
			message.error('Tổng tỷ lệ phải bằng 100%');
			return;
		}

		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
	};

	const anUongVal = Number(Form.useWatch('anUongPct', form) || 0);
	const diChuyenVal = Number(Form.useWatch('diChuyenPct', form) || 0);
	const luuTruVal = Number(Form.useWatch('luuTruPct', form) || 0);
	const thamQuanVal = Number(Form.useWatch('thamQuanPct', form) || 0);
	const tongHienTai = anUongVal + diChuyenVal + luuTruVal + thamQuanVal;

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='tenCauHinh' label='Tên cấu hình' rules={[{ required: true, message: 'Vui lòng nhập tên cấu hình' }]}>
				<Input />
			</Form.Item>
			<Row gutter={16}>
				<Col xs={24} md={12}><Form.Item name='anUongPct' label='Ăn uống (%)' rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
				<Col xs={24} md={12}><Form.Item name='diChuyenPct' label='Di chuyển (%)' rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
			</Row>
			<Row gutter={16}>
				<Col xs={24} md={12}><Form.Item name='luuTruPct' label='Lưu trú (%)' rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
				<Col xs={24} md={12}><Form.Item name='thamQuanPct' label='Tham quan (%)' rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
			</Row>
			<Form.Item label='Tổng tỷ lệ'>
				<Input value={`${Number(tongHienTai || 0)}%`} disabled />
			</Form.Item>
			<Form.Item name='macDinh' label='Đặt làm mặc định' valuePropName='checked'>
				<Switch />
			</Form.Item>
			<div style={{ textAlign: 'right' }}>
				<Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>
					Hủy
				</Button>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{edit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</div>
		</Form>
	);
};

const CauHinhPhanBoTab: React.FC = () => {
	const columns: IColumn<CauHinhPhanBoChiTieu>[] = [
		{ title: 'Tên cấu hình', dataIndex: 'tenCauHinh', width: 220, filterType: 'string', sortable: true },
		{ title: 'Ăn uống (%)', dataIndex: 'anUongPct', width: 130, sortable: true },
		{ title: 'Di chuyển (%)', dataIndex: 'diChuyenPct', width: 130, sortable: true },
		{ title: 'Lưu trú (%)', dataIndex: 'luuTruPct', width: 130, sortable: true },
		{ title: 'Tham quan (%)', dataIndex: 'thamQuanPct', width: 130, sortable: true },
		{ title: 'Mặc định', dataIndex: 'macDinh', width: 120, render: (v: boolean) => (v ? 'Có' : 'Không') },
		{
			title: 'Tổng (%)',
			width: 110,
			render: (_: any, row: CauHinhPhanBoChiTieu) =>
				Number(row.anUongPct || 0) + Number(row.diChuyenPct || 0) + Number(row.luuTruPct || 0) + Number(row.thamQuanPct || 0),
		},
	];

	return (
		<TableBase
			title=''
			modelName='dulich.phanBoChiTieu'
			columns={columns}
			Form={FormPhanBoChiTieu}
			formType='Drawer'
			widthDrawer={760}
		/>
	);
};

const NganSachPage: React.FC = () => {
	const { danhSach, getModel } = useModel('dulich.nganSach');
	const [data, setData] = useState<NganSachDuLich | null>(null);
	const [loading, setLoading] = useState(false);

	const tongNguonNganSach = useMemo(
		() => (danhSach || []).reduce((sum: number, item: NguonNganSach) => sum + Number(item?.soTien || 0), 0),
		[danhSach],
	);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await getTongQuanNganSach();
				setData(res?.data?.data || null);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		getModel();
	}, []);

	useEffect(() => {
		if (!danhSach) return;
		const fetchTongQuan = async () => {
			const res = await getTongQuanNganSach();
			setData(res?.data?.data || null);
		};
		fetchTongQuan();
	}, [danhSach]);

	const tongChi = useMemo(() => {
		if (!data) return 0;
		return data.anUong + data.diChuyen + data.luuTru + data.thamQuan;
	}, [data]);

	if (loading || !data) return <Spin />;

	const chartNguonNganSach = [
		(danhSach || [])
			.filter((item: NguonNganSach) => Number(item?.soTien || 0) > 0)
			.map((item: NguonNganSach) => ({ label: item.tenNguon, value: Number(item.soTien || 0) })),
	];

	const chartNguonLabels = chartNguonNganSach[0].map((x) => x.label);
	const chartNguonSeries = chartNguonNganSach[0].map((x) => x.value);
	const nganSachMucTieu = data.nganSachToiDa || tongNguonNganSach;

	return (
		<div style={{ padding: 24 }}>
			<Title level={3}>Quản lý ngân sách</Title>

			{tongChi > nganSachMucTieu && (
				<Alert
					showIcon
					type='error'
					message={`Vượt ngân sách: ${formatVND(tongChi - nganSachMucTieu)}`}
					style={{ marginBottom: 16 }}
				/>
			)}

			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} md={8}><Card><Statistic title='Tổng nguồn ngân sách' value={tongNguonNganSach} formatter={statisticVNDFormatter} /></Card></Col>
				<Col xs={24} md={8}><Card><Statistic title='Tổng chi hiện tại' value={tongChi} formatter={statisticVNDFormatter} /></Card></Col>
				<Col xs={24} md={8}><Card><Statistic title='Còn lại' value={tongNguonNganSach - tongChi} formatter={statisticVNDFormatter} /></Card></Col>
			</Row>

			<Tabs defaultActiveKey='tong-quan'>
				<Tabs.TabPane tab='Tổng quan ngân sách' key='tong-quan'>
					{data.tenCauHinhPhanBo && (
						<Alert
							type='info'
							showIcon
							message={`Phân bổ chi tiêu đang dùng cấu hình: ${data.tenCauHinhPhanBo}`}
							style={{ marginBottom: 16 }}
						/>
					)}
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={12}>
							<Card title='Phân bổ chi tiêu dự kiến'>
								<Chart
									type='pie'
									height={360}
									series={[data.anUong, data.diChuyen, data.luuTru, data.thamQuan]}
									options={{
										labels: ['Ăn uống', 'Di chuyển', 'Lưu trú', 'Tham quan'],
										legend: { position: 'bottom' },
									}}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card title='Cơ cấu nguồn ngân sách'>
								{chartNguonSeries.length ? (
									<Chart
										type='donut'
										height={360}
										series={chartNguonSeries}
										options={{
											labels: chartNguonLabels,
											legend: { position: 'bottom' },
										}}
									/>
								) : (
									<Alert type='info' showIcon message='Chưa có nguồn ngân sách. Vui lòng thêm ở tab Quản lý nguồn.' />
								)}
							</Card>
						</Col>
					</Row>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Quản lý nguồn ngân sách' key='quan-ly-nguon'>
					<QuanLyNguonNganSach />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Cấu hình phân bổ chi tiêu' key='cau-hinh-phan-bo'>
					<CauHinhPhanBoTab />
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default NganSachPage;
