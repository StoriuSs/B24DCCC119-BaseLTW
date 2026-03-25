import React from 'react';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { CauLacBo, ThanhVien } from '@/pages/QuanLyCauLacBo/typing';
import FormCLB from './FormCLB';
import { useModel } from 'umi';
import { Button, Empty, Image, Modal, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import ExpandText from '@/components/ExpandText';
import { getThanhVienPage } from '@/services/QuanLyCauLacBo/thanhVien';

const DanhSachCLBPage: React.FC = () => {
	const { getModel, handleEdit, deleteModel } = useModel('quanlycaulacbo.cauLacBo');
	const [memberModalOpen, setMemberModalOpen] = React.useState(false);
	const [memberLoading, setMemberLoading] = React.useState(false);
	const [memberRows, setMemberRows] = React.useState<ThanhVien[]>([]);
	const [selectedClubName, setSelectedClubName] = React.useState('');

	const memberColumns = [
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'SĐT', dataIndex: 'sdt', key: 'sdt', width: 130 },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh', width: 100 },
		{ title: 'Ngày đăng ký', dataIndex: 'ngayDangKy', key: 'ngayDangKy', width: 130 },
	];

	const openMemberModal = async (club: CauLacBo) => {
		setSelectedClubName(club.tenCLB);
		setMemberModalOpen(true);
		setMemberLoading(true);
		try {
			const response = await getThanhVienPage({ page: 1, limit: 1000, cauLacBoId: club.id });
			setMemberRows(response?.data?.data?.result || []);
		} catch (error) {
			message.error('Không tải được danh sách thành viên');
			setMemberRows([]);
		} finally {
			setMemberLoading(false);
		}
	};

	const tableColumns: IColumn<CauLacBo>[] = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			width: 120,
			align: 'center',
			render: (text: string) => (text ? <Image width={72} src={text} /> : <span>-</span>),
		},
		{
			title: 'Tên CLB',
			dataIndex: 'tenCLB',
			width: 220,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 160,
			sortable: true,
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 320,
			render: (moTa: string) => (
				<ExpandText ellipsis={{ rows: 2 }}>
					<div dangerouslySetInnerHTML={{ __html: moTa || '-' }} />
				</ExpandText>
			),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 120,
			align: 'center',
			render: (hoatDong: boolean) => (hoatDong ? <Tag color='green'>Có</Tag> : <Tag color='red'>Không</Tag>),
		},
		{
			title: 'Thao tác',
			width: 220,
			render: (_, record: CauLacBo) => (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Space size={4} wrap>
						<Tooltip title='Chỉnh sửa'>
							<Button type='link' size='small' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
								Chỉnh sửa
							</Button>
						</Tooltip>
						<Popconfirm
							title='Bạn có chắc chắn muốn xóa CLB này?'
							onConfirm={() => deleteModel(record._id || '', getModel)}
						>
							<Button type='link' size='small' danger icon={<DeleteOutlined />}>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
					<Space size={4} wrap>
						<Button type='link' size='small' icon={<TeamOutlined />} onClick={() => openMemberModal(record)}>
							Xem thành viên
						</Button>
					</Space>
				</div>
			),
		},
	];

	return (
		<>
			<TableBase
				title='Quản lý câu lạc bộ'
				modelName='quanlycaulacbo.cauLacBo'
				columns={tableColumns}
				Form={FormCLB as React.FC}
				buttons={{ filter: false }}
			/>

			<Modal
				title={`Thành viên CLB: ${selectedClubName}`}
				visible={memberModalOpen}
				onCancel={() => setMemberModalOpen(false)}
				footer={null}
				width={920}
			>
				<Table
					loading={memberLoading}
					columns={memberColumns}
					dataSource={memberRows}
					pagination={false}
					locale={{ emptyText: <Empty description='CLB chưa có thành viên' /> }}
					rowKey={(row: ThanhVien) => row._id || row.id}
				/>
			</Modal>
		</>
	);
};

export default DanhSachCLBPage;
