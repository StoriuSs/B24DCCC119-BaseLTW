import React, { useEffect } from 'react';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { IColumn } from '@/components/Table/typing';
import { CauHinhBieuMau } from '@/pages/QuanLyVanBang/typing';
import { Form, Input, Select, Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CauHinhEditor: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting, danhSach } =
		useModel('quanlyvanbang.cauHinh');
	const [form] = Form.useForm();

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [edit, record]);

	const handleSubmit = async (values: any) => {
		const normalizedValues = {
			...values,
			maTruong: values?.maTruong?.trim(),
			tenTruong: values?.tenTruong?.trim(),
		};

		if (edit && record?._id) {
			await putModel(record._id, normalizedValues);
		} else {
			await postModel(normalizedValues);
		}
	};

	const validateUniqueMaTruong = async (_: any, value: string) => {
		const normalizedValue = (value || '').trim().toLowerCase();
		if (!normalizedValue) return Promise.resolve();

		const isDuplicated = (danhSach || []).some((item: any) => {
			const itemCode = String(item?.maTruong || '')
				.trim()
				.toLowerCase();
			const itemId = item?._id || item?.id;
			const currentId = record?._id || record?.id;
			if (!itemCode) return false;
			if (edit && currentId && itemId === currentId) return false;
			return itemCode === normalizedValue;
		});

		if (isDuplicated) {
			return Promise.reject(new Error('Mã trường đã tồn tại, vui lòng nhập mã khác'));
		}
		return Promise.resolve();
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item
				name='maTruong'
				label='Mã trường (viết liền, không dấu)'
				rules={[{ required: true, message: 'Vui lòng nhập mã trường' }, { validator: validateUniqueMaTruong }]}
			>
				<Input placeholder='ví dụ: danToc' />
			</Form.Item>
			<Form.Item name='tenTruong' label='Tên trường hiển thị' rules={[{ required: true }]}>
				<Input placeholder='ví dụ: Dân tộc' />
			</Form.Item>
			<Form.Item name='kieuDuLieu' label='Kiểu dữ liệu' rules={[{ required: true }]}>
				<Select>
					<Select.Option value='String'>String (Chuỗi)</Select.Option>
					<Select.Option value='Number'>Number (Số)</Select.Option>
					<Select.Option value='Date'>Date (Ngày tháng)</Select.Option>
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

const CauHinhPage: React.FC = () => {
	const cauHinhCrudModel = useModel('quanlyvanbang.cauHinh');

	const onDeleteRecord = async (record: CauHinhBieuMau) => {
		const id = record?._id || record?.id;
		if (!id) return;
		await cauHinhCrudModel.deleteModel(id);
	};

	const tableColumns: IColumn<CauHinhBieuMau>[] = [
		{ title: 'Mã trường', dataIndex: 'maTruong', width: 200, filterType: 'string' },
		{ title: 'Tên trường', dataIndex: 'tenTruong', width: 250, filterType: 'string' },
		{ title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', align: 'center', width: 150 },
		{
			title: 'Thao tác',
			width: 160,
			align: 'center',
			render: (_: any, row: CauHinhBieuMau) => (
				<Space size={4}>
					<Button type='link' icon={<EditOutlined />} onClick={() => cauHinhCrudModel.handleEdit(row)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa cấu hình này?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => onDeleteRecord(row)}
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<TableBase
			title='Cấu hình biểu mẫu văn bằng'
			modelName='quanlyvanbang.cauHinh'
			columns={tableColumns}
			Form={CauHinhEditor}
		/>
	);
};

export default CauHinhPage;
