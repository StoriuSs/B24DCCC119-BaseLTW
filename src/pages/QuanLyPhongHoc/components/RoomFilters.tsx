import React from 'react';
import { Button, Input, Select, Space } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { RoomFilters, RoomType, SeatSortOrder } from '@/services/QuanLyPhongHoc/typing';

interface RoomFiltersProps {
	filters: RoomFilters;
	roomTypeOptions: { value: RoomType; label: string }[];
	responsibleTeachers: string[];
	seatSortOrder: SeatSortOrder;
	onChange: (partial: Partial<RoomFilters>) => void;
	onReset: () => void;
	onToggleSort: () => void;
	onToggleAdvanced: () => void;
}

const RoomFiltersPanel: React.FC<RoomFiltersProps> = ({
	filters,
	roomTypeOptions,
	responsibleTeachers,
	seatSortOrder,
	onChange,
	onReset,
	onToggleSort,
	onToggleAdvanced,
}) => {
	return (
		<Space wrap style={{ width: '100%' }}>
			<Input
				allowClear
				style={{ width: 240 }}
				placeholder='Tìm theo mã phòng/tên phòng'
				value={filters.keyword}
				onChange={(event) => onChange({ keyword: event.target.value })}
			/>

			<Select<RoomType>
				allowClear
				style={{ width: 180 }}
				placeholder='Lọc loại phòng'
				value={filters.loaiPhong}
				onChange={(value) => onChange({ loaiPhong: value })}
			>
				{roomTypeOptions.map((option) => (
					<Select.Option key={option.value} value={option.value}>
						{option.label}
					</Select.Option>
				))}
			</Select>

			<Select<string>
				allowClear
				style={{ width: 220 }}
				placeholder='Lọc người phụ trách'
				value={filters.nguoiPhuTrach}
				onChange={(value) => onChange({ nguoiPhuTrach: value })}
			>
				{responsibleTeachers.map((name) => (
					<Select.Option key={name} value={name}>
						{name}
					</Select.Option>
				))}
			</Select>

			<Button
				icon={seatSortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
				onClick={onToggleSort}
			>
				Sắp xếp chỗ ngồi: {seatSortOrder === 'ascend' ? 'Tăng dần' : 'Giảm dần'}
			</Button>

			<Button onClick={onToggleAdvanced}>Advanced Filter</Button>
			<Button onClick={onReset}>Xóa lọc</Button>
		</Space>
	);
};

export default RoomFiltersPanel;
