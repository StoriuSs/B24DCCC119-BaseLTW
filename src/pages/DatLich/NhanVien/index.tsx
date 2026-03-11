import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNhanVien from './components/Form';

const NhanVienPage = () => {
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
	} = useModel('datlich.nhanvien');

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<DatLich.NhanVien>[] = [
		{ title: 'Mã', dataIndex: 'maNhanVien', width: 120 },
		{ title: 'Tên nhân viên', dataIndex: 'tenNhanVien', width: 220 },
		{ title: 'Số khách tối đa/ngày', dataIndex: 'soKhachToiDaMoiNgay', width: 170 },
		{
			title: 'Lịch làm việc',
			width: 260,
			render: (recordItem: DatLich.NhanVien) =>
				recordItem.lichLamViec
					.map((item: DatLich.LichLamViec) => `T${item.thu + 1} ${item.gioBatDau}-${item.gioKetThuc}`)
					.join(', '),
		},
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
			title='Quản lý nhân viên'
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
					Thêm nhân viên
				</Button>
			}
		>
			<Table rowKey='_id' loading={loading} dataSource={danhSach} columns={columns} pagination={{ pageSize: 10 }} />

			<Modal
				title={isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
				visible={visibleForm}
				footer={false}
				onCancel={() => setVisibleForm(false)}
				destroyOnClose
			>
				<FormNhanVien
					record={record}
					isEdit={isEdit}
					onCancel={() => setVisibleForm(false)}
					onSubmit={(payload) => submit(payload)}
				/>
			</Modal>
		</Card>
	);
};

export default NhanVienPage;
