import React, { useEffect } from 'react';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { IColumn } from '@/components/Table/typing';
import { SoVanBang } from '@/pages/QuanLyVanBang/typing';
import { Form, Input, InputNumber, Button } from 'antd';

const SoVanBangEditor: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('quanlyvanbang.soVanBang');
	const [form] = Form.useForm();

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [edit, record]);

	const handleSubmit = async (values: any) => {
		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='tenSo' label='Tên sổ' rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}>
				<Input />
			</Form.Item>
			<Form.Item name='nam' label='Năm' rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
				<InputNumber style={{ width: '100%' }} min={2000} max={2100} placeholder='VD: 2024' />
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

const SoVanBangPage: React.FC = () => {
	const tableColumns: IColumn<SoVanBang>[] = [
		{ title: 'Tên sổ', dataIndex: 'tenSo', width: 250, filterType: 'string' },
		{ title: 'Năm', dataIndex: 'nam', width: 150, filterType: 'string' },
		{ title: 'Số vào sổ hiện tại', dataIndex: 'soVaoSoHienTai', align: 'center', width: 150 },
	];

	return (
		<TableBase
			title='Quản lý sổ văn bằng'
			modelName='quanlyvanbang.soVanBang'
			columns={tableColumns}
			Form={SoVanBangEditor}
		/>
	);
};

export default SoVanBangPage;
