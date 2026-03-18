import React, { useEffect } from 'react';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { IColumn } from '@/components/Table/typing';
import { QuyetDinhTotNghiep } from '@/pages/QuanLyVanBang/typing';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';

const QuyetDinhEditor: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('quanlyvanbang.quyetDinh');
	const soVanBangStoreModel = useModel('quanlyvanbang.soVanBang');
	const [form] = Form.useForm();

	useEffect(() => {
		soVanBangStoreModel.getAllModel();
	}, []);

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({
				...record,
				ngayBanHanh: record.ngayBanHanh ? moment(record.ngayBanHanh) : undefined,
			});
		} else {
			form.resetFields();
		}
	}, [edit, record]);

	const handleSubmit = async (values: any) => {
		const payload = {
			...values,
			ngayBanHanh: values.ngayBanHanh?.toISOString(),
		};
		if (edit && record?._id) {
			await putModel(record._id, payload);
		} else {
			await postModel(payload);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='soSQ' label='Số hiệu QĐ' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item name='ngayBanHanh' label='Ngày ban hành' rules={[{ required: true }]}>
				<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
			</Form.Item>
			<Form.Item name='trichYeu' label='Trích yếu'>
				<Input.TextArea />
			</Form.Item>
			<Form.Item name='soVanBangId' label='Sổ văn bằng' rules={[{ required: true }]}>
				<Select>
					{(soVanBangStoreModel.danhSach || []).map((item: any) => (
						<Select.Option key={item._id || item.id} value={item._id || item.id}>
							{item.tenSo}
						</Select.Option>
					))}
				</Select>
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

const QuyetDinhPage: React.FC = () => {
	const soVanBangStoreModel = useModel('quanlyvanbang.soVanBang');

	useEffect(() => {
		soVanBangStoreModel.getAllModel();
	}, []);

	const tableColumns: IColumn<QuyetDinhTotNghiep>[] = [
		{ title: 'Số hiệu QĐ', dataIndex: 'soSQ', width: 150, filterType: 'string' },
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			width: 150,
			render: (val: any) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{ title: 'Trích yếu', dataIndex: 'trichYeu', width: 300 },
		{
			title: 'Sổ văn bằng',
			dataIndex: 'soVanBangId',
			width: 200,
			render: (val: any) =>
				(soVanBangStoreModel.danhSach || []).find((item: any) => (item._id || item.id) === val)?.tenSo || '-',
		},
		{ title: 'Lượt tra cứu', dataIndex: 'soLuotTraCuu', align: 'center', width: 120 },
	];

	return (
		<TableBase
			title='Quản lý quyết định tốt nghiệp'
			modelName='quanlyvanbang.quyetDinh'
			columns={tableColumns}
			Form={QuyetDinhEditor}
		/>
	);
};

export default QuyetDinhPage;
