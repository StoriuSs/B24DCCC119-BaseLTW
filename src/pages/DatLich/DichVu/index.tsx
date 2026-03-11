import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDichVu from './components/Form';

const formatCurrency = (val: number) => `${new Intl.NumberFormat('vi-VN').format(val)} VND`;

const DichVuPage = () => {
	const {
		danhSach,
		loading,
		visibleForm,
		setVisibleForm,
		record,
		setRecord,
		isEdit,
		setIsEdit,
		getData,
		submit,
		remove,
	} = useModel('datlich.dichvu');

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<DatLich.DichVu>[] = [
		{ title: 'Mã', dataIndex: 'maDichVu', width: 120 },
		{ title: 'Tên dịch vụ', dataIndex: 'tenDichVu', width: 220 },
		{ title: 'Giá', width: 140, render: (recordItem) => formatCurrency(recordItem.gia) },
		{ title: 'Thời lượng', width: 140, render: (recordItem) => `${recordItem.thoiLuongPhut} phút` },
		{ title: 'Mô tả', dataIndex: 'moTa', width: 260 },
		{
			title: 'Trạng thái',
			width: 130,
			render: (recordItem) => (
				<Tag color={recordItem.trangThai === 'ACTIVE' ? 'green' : 'default'}>
					{recordItem.trangThai === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			render: (recordItem) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setRecord(recordItem);
								setIsEdit(true);
								setVisibleForm(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Bạn chắc chắn muốn xóa?' onConfirm={() => remove(recordItem._id)}>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Card
			title='Quản lý dịch vụ'
			extra={
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setRecord(undefined);
						setIsEdit(false);
						setVisibleForm(true);
					}}
				>
					Thêm dịch vụ
				</Button>
			}
		>
			<Table rowKey='_id' loading={loading} dataSource={danhSach} columns={columns} pagination={{ pageSize: 10 }} />

			<Modal
				title={isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
				visible={visibleForm}
				footer={false}
				onCancel={() => setVisibleForm(false)}
				destroyOnClose
			>
				<FormDichVu
					record={record}
					isEdit={isEdit}
					onCancel={() => setVisibleForm(false)}
					onSubmit={(payload) => submit(payload)}
				/>
			</Modal>
		</Card>
	);
};

export default DichVuPage;
