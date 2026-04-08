import React, { useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Card, Empty, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QLCVNTask, TaskFiltersState } from '@/pages/QuanLyCongViecNhom/typing';
import LoginPanel from '@/pages/QuanLyCongViecNhom/components/LoginPanel';
import TaskFilters from '@/pages/QuanLyCongViecNhom/components/TaskFilters';
import TaskForm from '@/pages/QuanLyCongViecNhom/components/TaskForm';
import TaskTable from '@/pages/QuanLyCongViecNhom/components/TaskTable';
import useQLCVNData from '@/pages/QuanLyCongViecNhom/hooks/useQLCVNData';

const DEFAULT_FILTERS: TaskFiltersState = {
	keyword: '',
	onlyMine: false,
};

const normalize = (value: string) => value.trim().toLowerCase();

const CongViecPage: React.FC = () => {
	const { currentUser, users, tasks, session, login, logout, createTask, updateTask, deleteTask } = useQLCVNData();
	const [filters, setFilters] = useState<TaskFiltersState>(DEFAULT_FILTERS);
	const [taskModalVisible, setTaskModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<QLCVNTask>();

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			if (filters.keyword && !normalize(task.title).includes(normalize(filters.keyword))) return false;
			if (filters.status && task.status !== filters.status) return false;
			if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
			if (filters.onlyMine && session?.userId && task.assigneeId !== session.userId) return false;
			return true;
		});
	}, [filters, tasks, session]);

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
				<Alert style={{ marginTop: 16 }} type='warning' showIcon message='Vui lòng đăng nhập để quản lý công việc.' />
			) : (
				<Card
					style={{ marginTop: 16 }}
					title='Danh sách công việc nhóm'
					extra={
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								setEditingTask(undefined);
								setTaskModalVisible(true);
							}}
						>
							Thêm công việc
						</Button>
					}
				>
					<Space direction='vertical' size={12} style={{ width: '100%' }}>
						<TaskFilters
							filters={filters}
							users={users}
							onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
							onClear={() => setFilters(DEFAULT_FILTERS)}
						/>
						{filteredTasks.length === 0 ? (
							<Empty description='Không có công việc phù hợp bộ lọc hiện tại' />
						) : (
							<TaskTable
								tasks={filteredTasks}
								users={users}
								onDelete={(taskId) => {
									const result = deleteTask(taskId);
									if (result.success) message.success(result.message);
									else message.error(result.message);
								}}
								onEdit={(task) => {
									setEditingTask(task);
									setTaskModalVisible(true);
								}}
							/>
						)}
					</Space>
					<TaskForm
						visible={taskModalVisible}
						users={users}
						editingTask={editingTask}
						onCancel={() => {
							setTaskModalVisible(false);
							setEditingTask(undefined);
						}}
						onSubmit={(payload) => {
							const result = editingTask ? updateTask(editingTask.id, payload) : createTask(payload);
							if (result.success) {
								message.success(result.message);
								setTaskModalVisible(false);
								setEditingTask(undefined);
							} else message.error(result.message);
						}}
					/>
				</Card>
			)}
		</PageContainer>
	);
};

export default CongViecPage;
