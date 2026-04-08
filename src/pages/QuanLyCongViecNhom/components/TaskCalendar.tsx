import React from 'react';
import { Badge, Calendar, Card, Empty, Typography } from 'antd';
import { Moment } from 'moment';
import { QLCVNTask } from '@/pages/QuanLyCongViecNhom/typing';

interface TaskCalendarProps {
	tasks: QLCVNTask[];
	selectedDate?: string;
	onSelectDate: (date?: string) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, selectedDate, onSelectDate }) => {
	const getListData = (value: Moment) => {
		const date = value.format('YYYY-MM-DD');
		return tasks.filter((task) => task.deadline === date);
	};

	return (
		<Card
			title='Calendar deadline'
			extra={
				selectedDate ? (
					<Typography.Link onClick={() => onSelectDate(undefined)}>Bỏ lọc ngày ({selectedDate})</Typography.Link>
				) : null
			}
		>
			{tasks.length === 0 ? (
				<Empty description='Chưa có deadline để hiển thị' />
			) : (
				<Calendar
					fullscreen={false}
					onSelect={(date) => onSelectDate(date.format('YYYY-MM-DD'))}
					dateCellRender={(value) => {
						const listData = getListData(value);
						if (!listData.length) return null;
						return (
							<ul style={{ margin: 0, paddingLeft: 16 }}>
								{listData.slice(0, 2).map((item) => (
									<li key={item.id}>
										<Badge status={item.status === 'DA_XONG' ? 'success' : 'processing'} text={item.title} />
									</li>
								))}
							</ul>
						);
					}}
				/>
			)}
		</Card>
	);
};

export default TaskCalendar;
