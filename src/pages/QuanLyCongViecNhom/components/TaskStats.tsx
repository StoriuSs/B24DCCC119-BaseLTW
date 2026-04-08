import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';

interface TaskStatsProps {
	total: number;
	completed: number;
}

const TaskStats: React.FC<TaskStatsProps> = ({ total, completed }) => {
	return (
		<Row gutter={12}>
			<Col xs={24} md={12}>
				<Card size='small'>
					<Statistic title='Tổng số công việc' value={total} />
				</Card>
			</Col>
			<Col xs={24} md={12}>
				<Card size='small'>
					<Statistic title='Số công việc đã hoàn thành' value={completed} />
				</Card>
			</Col>
		</Row>
	);
};

export default TaskStats;
