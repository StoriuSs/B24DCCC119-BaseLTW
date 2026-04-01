import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Button, Col, Form, Input, InputNumber, Row, Select, Switch, Tabs } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { DiemDen } from '@/pages/DuLich/typing';
import { formatVND } from '@/pages/DuLich/utils';
import AdminThongKePage from '@/pages/DuLich/AdminThongKe';

const FormDiemDen: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('dulich.diemDen');
	const [form] = Form.useForm();

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
			form.setFieldsValue({ noiBat: false, rating: 4.5, loaiHinh: 'Thanh pho' });
		}
	}, [edit, form, record]);

	const handleSubmit = async (values: any) => {
		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='ten' label='Tên điểm đến' rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}>
				<Input />
			</Form.Item>
			<Form.Item name='diaDiem' label='Địa điểm' rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
				<Input />
			</Form.Item>
			<Form.Item name='moTa' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
				<Input.TextArea rows={3} />
			</Form.Item>
			<Row gutter={16}>
				<Col xs={24} sm={12}>
					<Form.Item name='loaiHinh' label='Loại hình'>
						<Select style={{ width: '100%' }}>
							<Select.Option value='Bien'>Biển</Select.Option>
							<Select.Option value='Nui'>Núi</Select.Option>
							<Select.Option value='Thanh pho'>Thành phố</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				<Col xs={24} sm={12}>
					<Form.Item name='rating' label='Rating'>
						<InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col xs={24} sm={12} lg={6}>
					<Form.Item name='giaTrungBinh' label='Giá TB'>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Form.Item name='chiPhiAnUong' label='Chi phí ăn uống'>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Form.Item name='chiPhiLuuTru' label='Chi phí lưu trú'>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Form.Item name='chiPhiDiChuyen' label='Chi phí di chuyển'>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col xs={24} md={10}>
					<Form.Item name='thoiGianThamQuanGio' label='Thời gian tham quan (giờ)'>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col xs={24} md={14}>
					<Form.Item name='hinhAnh' label='URL hình ảnh'>
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name='noiBat' label='Nổi bật' valuePropName='checked'>
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

const QuanLyDiemDenTab: React.FC = () => {
	const columns: IColumn<DiemDen>[] = [
		{ title: 'Tên điểm đến', dataIndex: 'ten', width: 220, filterType: 'string', sortable: true },
		{ title: 'Địa điểm', dataIndex: 'diaDiem', width: 180, filterType: 'string' },
		{ title: 'Loại hình', dataIndex: 'loaiHinh', width: 130, filterType: 'select', filterData: ['Bien', 'Nui', 'Thanh pho'] },
		{ title: 'Rating', dataIndex: 'rating', width: 100, sortable: true },
		{ title: 'Giá TB', dataIndex: 'giaTrungBinh', width: 140, sortable: true, render: (v: number) => formatVND(v) },
		{ title: 'Nổi bật', dataIndex: 'noiBat', width: 100, render: (v: boolean) => (v ? 'Có' : 'Không') },
	];

	return (
		<TableBase
			title=''
			modelName='dulich.diemDen'
			columns={columns}
			Form={FormDiemDen}
			formType='Drawer'
			widthDrawer={980}
		/>
	);
};

const AdminDiemDenPage: React.FC = () => {
	return (
		<div style={{ padding: 24 }}>
			<Tabs defaultActiveKey='quan-ly' tabBarStyle={{ marginBottom: 16 }}>
				<Tabs.TabPane tab='Quản lý điểm đến' key='quan-ly'>
					<QuanLyDiemDenTab />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Thống kê' key='thong-ke'>
					<AdminThongKePage />
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default AdminDiemDenPage;
