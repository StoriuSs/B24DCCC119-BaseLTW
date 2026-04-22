import React from 'react';
import { Button, Empty, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Room, RoomType } from '@/services/QuanLyPhongHoc/typing';

interface RoomTableProps {
	rooms: Room[];
	onEdit: (room: Room) => void;
	onDelete: (room: Room) => void;
}

const roomTypeLabel: Record<RoomType, string> = {
	LY_THUYET: 'Lý thuyết',
	THUC_HANH: 'Thực hành',
	HOI_TRUONG: 'Hội trường',
};

const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit, onDelete }) => {
	return (
		<Table<Room>
			rowKey='id'
			dataSource={rooms}
			pagination={{ pageSize: 8, showSizeChanger: false }}
			locale={{ emptyText: <Empty description='Không có phòng học nào.' /> }}
			columns={[
				{ title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
				{ title: 'Tên phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
				{
					title: 'Số chỗ ngồi',
					dataIndex: 'soChoNgoi',
					key: 'soChoNgoi',
					align: 'right',
					width: 130,
				},
				{
					title: 'Loại phòng',
					dataIndex: 'loaiPhong',
					key: 'loaiPhong',
					render: (value: RoomType) => <Tag color='blue'>{roomTypeLabel[value]}</Tag>,
				},
				{ title: 'Người phụ trách', dataIndex: 'nguoiPhuTrach', key: 'nguoiPhuTrach' },
				{
					title: 'Thao tác',
					key: 'actions',
					width: 130,
					render: (_, record) => (
						<Space>
							<Tooltip title='Chỉnh sửa'>
								<Button type='text' icon={<EditOutlined />} onClick={() => onEdit(record)} />
							</Tooltip>
							<Popconfirm
								title='Bạn có chắc chắn muốn xóa phòng này?'
								okText='Xóa'
								cancelText='Hủy'
								placement='topLeft'
								onConfirm={() => onDelete(record)}
							>
								<Button type='text' danger icon={<DeleteOutlined />} title='Chỉ xóa phòng dưới 30 chỗ ngồi' />
							</Popconfirm>
						</Space>
					),
				},
			]}
		/>
	);
};

export default RoomTable;
