import React, { useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, Col, Empty, List, Row, Typography, message } from 'antd';
import LoginPanel from '@/pages/QuanLyCongViecNhom/components/LoginPanel';
import TaskCalendar from '@/pages/QuanLyCongViecNhom/components/TaskCalendar';
import TaskStats from '@/pages/QuanLyCongViecNhom/components/TaskStats';
import useQLCVNData from '@/pages/QuanLyCongViecNhom/hooks/useQLCVNData';

const LichThongKePage: React.FC = () => {
	const { currentUser, tasks, users, completedCount, login, logout } = useQLCVNData();
	const [selectedDate, setSelectedDate] = useState<string>();

	const assigneeNameById = useMemo(() => {
		return users.reduce<Record<string, string>>((acc, user) => {
			acc[user.id] = user.name;
			return acc;
		}, {});
	}, [users]);

	const selectedDateTasks = useMemo(() => {
		if (!selectedDate) return [];
		return tasks.filter((task) => task.deadline === selectedDate);
	}, [selectedDate, tasks]);

	return (
		<PageContainer>
			<LoginPanel
				currentUser={currentUser}
				onLogin={(payload) => {
					const result = login(payload);
					if (result.success) message.success(result.message);
					else message.error(result.message);
				}}
				onLogout={() => message.success(logout().message)}
			/>

			{!currentUser ? (
				<Alert
					style={{ marginTop: 16 }}
					type='warning'
					showIcon
					message='Vui lòng đăng nhập để xem lịch và thống kê.'
				/>
			) : (
				<>
					<div style={{ marginTop: 16 }}>
						<TaskStats total={tasks.length} completed={completedCount} />
					</div>
					<Row gutter={16} style={{ marginTop: 16 }}>
						<Col xs={24} lg={14}>
							<TaskCalendar tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
						</Col>
						<Col xs={24} lg={10}>
							<Card title={selectedDate ? `Công việc ngày ${selectedDate}` : 'Chọn ngày trên calendar để xem chi tiết'}>
								{!selectedDate ? (
									<Empty description='Chưa chọn ngày' />
								) : selectedDateTasks.length === 0 ? (
									<Empty description='Không có công việc trong ngày đã chọn' />
								) : (
									<List
										dataSource={selectedDateTasks}
										renderItem={(item) => (
											<List.Item>
												<List.Item.Meta
													title={item.title}
													description={
														<Typography.Text type='secondary'>
															Người được giao: {assigneeNameById[item.assigneeId] || 'Không xác định'} | Trạng thái:{' '}
															{item.status}
														</Typography.Text>
													}
												/>
											</List.Item>
										)}
									/>
								)}
							</Card>
						</Col>
					</Row>
				</>
			)}
		</PageContainer>
	);
};

export default LichThongKePage;
