import React from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { RoomFilters } from '@/services/QuanLyPhongHoc/typing';

interface AdvancedFilterProps {
	visible: boolean;
	filters: RoomFilters;
	onChange: (partial: Partial<RoomFilters>) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ visible, filters, onChange }) => {
	if (!visible) return null;

	return (
		<Card size='small' title='Lọc nâng cao'>
			<Form layout='vertical'>
				<Row gutter={12}>
					<Col xs={24} md={8}>
						<Form.Item label='Mã phòng gần đúng'>
							<Input
								allowClear
								value={filters.maPhong}
								onChange={(event) => onChange({ maPhong: event.target.value })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item label='Tên phòng gần đúng'>
							<Input
								allowClear
								value={filters.tenPhong}
								onChange={(event) => onChange({ tenPhong: event.target.value })}
							/>
						</Form.Item>
					</Col>
					<Col xs={12} md={4}>
						<Form.Item label='Số chỗ tối thiểu'>
							<InputNumber
								style={{ width: '100%' }}
								value={filters.minSeats}
								onChange={(value) => onChange({ minSeats: typeof value === 'number' ? value : undefined })}
							/>
						</Form.Item>
					</Col>
					<Col xs={12} md={4}>
						<Form.Item label='Số chỗ tối đa'>
							<InputNumber
								style={{ width: '100%' }}
								value={filters.maxSeats}
								onChange={(value) => onChange({ maxSeats: typeof value === 'number' ? value : undefined })}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Button
				onClick={() =>
					onChange({
						maPhong: undefined,
						tenPhong: undefined,
						minSeats: undefined,
						maxSeats: undefined,
					})
				}
			>
				Xóa điều kiện nâng cao
			</Button>
		</Card>
	);
};

export default AdvancedFilter;
