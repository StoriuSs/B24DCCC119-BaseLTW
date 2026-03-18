import React, { useEffect } from 'react';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { IColumn } from '@/components/Table/typing';
import { ThongTinVanBang } from '@/pages/QuanLyVanBang/typing';
import { Form, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import moment from 'moment';

const ThongTinEditor: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('quanlyvanbang.thongTin');
	const quyetDinhStoreModel = useModel('quanlyvanbang.quyetDinh');
	const cauHinhStoreModel = useModel('quanlyvanbang.cauHinh');
	const soVanBangStoreModel = useModel('quanlyvanbang.soVanBang');
	const [form] = Form.useForm();

	useEffect(() => {
		quyetDinhStoreModel.getAllModel();
		cauHinhStoreModel.getAllModel();
	}, []);

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({
				...record,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
			});
		} else {
			form.resetFields();
		}
	}, [edit, record]);

	const renderExtraField = (configField: any) => {
		switch (configField.kieuDuLieu) {
			case 'Number':
				return <InputNumber style={{ width: '100%' }} />;
			case 'Date':
				return <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />;
			default:
				return <Input />;
		}
	};

	const handleSubmit = async (values: any) => {
		const payload = {
			...values,
			ngaySinh: values.ngaySinh?.toISOString(),
		};
		if (edit && record?._id) {
			await putModel(record._id, payload);
		} else {
			await postModel(payload);
			soVanBangStoreModel.getModel();
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item name='maSinhVien' label='Mã sinh viên' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item name='hoTen' label='Họ tên' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item name='ngaySinh' label='Ngày sinh' rules={[{ required: true }]}>
				<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
			</Form.Item>
			<Form.Item name='quyetDinhId' label='Quyết định tốt nghiệp' rules={[{ required: true }]}>
				<Select>
					{quyetDinhStoreModel.danhSach.map((item: any) => (
						<Select.Option key={item._id || item.id} value={item._id || item.id}>
							{item.soSQ}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			{cauHinhStoreModel.danhSach.length > 0 && <h4>Thông tin bổ sung</h4>}
			{cauHinhStoreModel.danhSach.map((fieldConfig: any) => (
				<Form.Item
					key={fieldConfig._id || fieldConfig.id}
					name={['extraFields', fieldConfig.maTruong]}
					label={fieldConfig.tenTruong}
				>
					{renderExtraField(fieldConfig)}
				</Form.Item>
			))}

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

const ThongTinPage: React.FC = () => {
	const quyetDinhStoreModel = useModel('quanlyvanbang.quyetDinh');
	const cauHinhStoreModel = useModel('quanlyvanbang.cauHinh');

	useEffect(() => {
		quyetDinhStoreModel.getAllModel();
		cauHinhStoreModel.getAllModel();
	}, []);

	const baseColumns: IColumn<ThongTinVanBang>[] = [
		{ title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', width: 150, filterType: 'string' },
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', align: 'center', width: 100 },
		{ title: 'MSV', dataIndex: 'maSinhVien', width: 120, filterType: 'string' },
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 200, filterType: 'string' },
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 120,
			render: (val: any) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			width: 180,
			render: (val: any) =>
				quyetDinhStoreModel.danhSach.find((item: any) => (item._id || item.id) === val)?.soSQ || '-',
		},
	];

	const extraColumns: IColumn<any>[] = cauHinhStoreModel.danhSach.map((fieldConfig: any) => ({
		title: fieldConfig.tenTruong,
		dataIndex: ['extraFields', fieldConfig.maTruong],
		width: 150,
		render: (val: any) => {
			if (val === undefined || val === null) return '-';
			if (fieldConfig.kieuDuLieu === 'Date') return moment(val).format('DD/MM/YYYY');
			return val;
		},
	}));

	const tableColumns = [...baseColumns, ...extraColumns];

	return (
		<TableBase
			title='Quản lý thông tin văn bằng'
			modelName='quanlyvanbang.thongTin'
			columns={tableColumns}
			scroll={{ x: 1200 + extraColumns.length * 150 }}
			Form={ThongTinEditor}
		/>
	);
};

export default ThongTinPage;
