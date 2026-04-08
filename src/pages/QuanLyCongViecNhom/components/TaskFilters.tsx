import React from 'react';
import { Button, Checkbox, Col, Input, Row, Select, Space } from 'antd';
import { QLCVNUser, TaskFiltersState, TaskStatus } from '@/pages/QuanLyCongViecNhom/typing';

interface TaskFiltersProps {
	filters: TaskFiltersState;
	users: QLCVNUser[];
	onChange: (partial: Partial<TaskFiltersState>) => void;
	onClear: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, users, onChange, onClear }) => {
	return (
		<Row gutter={[12, 12]} align='middle'>
			<Col xs={24} md={8}>
				<Input.Search
					allowClear
					placeholder='Tìm theo tên công việc...'
					value={filters.keyword}
					onChange={(event) => onChange({ keyword: event.target.value })}
				/>
			</Col>
			<Col xs={24} md={6}>
				<Select<TaskStatus | undefined>
					allowClear
					placeholder='Lọc trạng thái'
					style={{ width: '100%' }}
					value={filters.status}
					onChange={(value) => onChange({ status: value })}
				>
					<Select.Option value='CHUA_LAM'>Chưa làm</Select.Option>
					<Select.Option value='DANG_LAM'>Đang làm</Select.Option>
					<Select.Option value='DA_XONG'>Đã xong</Select.Option>
				</Select>
			</Col>
			<Col xs={24} md={6}>
				<Select<string | undefined>
					allowClear
					showSearch
					optionFilterProp='children'
					filterOption={(input, option) =>
						String(option?.children || '')
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					placeholder='Lọc theo người được giao'
					style={{ width: '100%' }}
					value={filters.assigneeId}
					onChange={(value) => onChange({ assigneeId: value })}
				>
					{users.map((user) => (
						<Select.Option key={user.id} value={user.id}>
							{user.name}
						</Select.Option>
					))}
				</Select>
			</Col>
			<Col xs={24} md={4}>
				<Space>
					<Checkbox checked={filters.onlyMine} onChange={(event) => onChange({ onlyMine: event.target.checked })}>
						Công việc của tôi
					</Checkbox>
					<Button onClick={onClear}>Reset</Button>
				</Space>
			</Col>
		</Row>
	);
};

export default TaskFilters;
