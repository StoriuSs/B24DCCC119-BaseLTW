import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import AdvancedFilter from './components/AdvancedFilter';
import RoomFilters from './components/RoomFilters';
import RoomForm from './components/RoomForm';
import RoomTable from './components/RoomTable';
import { Room } from '@/services/QuanLyPhongHoc/typing';

const QuanLyPhongHocPage: React.FC = () => {
	const {
		filteredRooms,
		filters,
		seatSortOrder,
		responsibleTeachers,
		roomTypeOptions,
		setFilters,
		resetFilters,
		setSeatSortOrder,
		addRoom,
		editRoom,
		removeRoom,
	} = useModel('quanlyphonghoc.index');

	const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [editingRoom, setEditingRoom] = useState<Room>();

	return (
		<PageContainer>
			<Space direction='vertical' size={16} style={{ width: '100%' }}>
				<Card
					title='Danh sách phòng học'
					extra={
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								setEditingRoom(undefined);
								setVisibleForm(true);
							}}
						>
							Thêm phòng học
						</Button>
					}
				>
					<Space direction='vertical' size={12} style={{ width: '100%' }}>
						<RoomFilters
							filters={filters}
							roomTypeOptions={roomTypeOptions}
							responsibleTeachers={responsibleTeachers}
							seatSortOrder={seatSortOrder}
							onChange={(partial) => setFilters((prev: any) => ({ ...prev, ...partial }))}
							onReset={resetFilters}
							onToggleSort={() => setSeatSortOrder(seatSortOrder === 'ascend' ? 'descend' : 'ascend')}
							onToggleAdvanced={() => setShowAdvancedFilter((prev) => !prev)}
						/>

						<AdvancedFilter
							visible={showAdvancedFilter}
							filters={filters}
							onChange={(partial) => setFilters((prev: any) => ({ ...prev, ...partial }))}
						/>

						<RoomTable
							rooms={filteredRooms}
							onEdit={(room) => {
								setEditingRoom(room);
								setVisibleForm(true);
							}}
							onDelete={(room) => {
								const result = removeRoom(room.id);
								if (result.success) {
									message.success(result.message);
								} else {
									message.error(result.message);
								}
							}}
						/>
					</Space>
				</Card>
			</Space>

			<RoomForm
				visible={visibleForm}
				editingRoom={editingRoom}
				roomTypeOptions={roomTypeOptions}
				responsibleTeachers={responsibleTeachers}
				onCancel={() => {
					setVisibleForm(false);
					setEditingRoom(undefined);
				}}
				onSubmit={(payload) => {
					const result = editingRoom ? editRoom(editingRoom.id, payload) : addRoom(payload);
					if (result.success) {
						message.success(result.message);
						setVisibleForm(false);
						setEditingRoom(undefined);
					} else {
						message.error(result.message);
					}
				}}
			/>
		</PageContainer>
	);
};

export default QuanLyPhongHocPage;
