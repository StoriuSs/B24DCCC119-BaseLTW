import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Card, Col, Empty, message, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
	AuthSession,
	QLCVNTask,
	QLCVNUser,
	TaskFiltersState,
	TaskPriority,
	TaskStatus,
} from '@/pages/QuanLyCongViecNhom/typing';
import {
	clearAuthSession,
	loadAuthSession,
	loadTasks,
	loadUsers,
	saveAuthSession,
	saveTasks,
	saveUsers,
} from '@/pages/QuanLyCongViecNhom/utils/storage';
import LoginPanel from '@/pages/QuanLyCongViecNhom/components/LoginPanel';
import UserManager from '@/pages/QuanLyCongViecNhom/components/UserManager';
import TaskForm from '@/pages/QuanLyCongViecNhom/components/TaskForm';
import TaskTable from '@/pages/QuanLyCongViecNhom/components/TaskTable';
import TaskFilters from '@/pages/QuanLyCongViecNhom/components/TaskFilters';
import TaskCalendar from '@/pages/QuanLyCongViecNhom/components/TaskCalendar';
import TaskStats from '@/pages/QuanLyCongViecNhom/components/TaskStats';

const DEFAULT_FILTERS: TaskFiltersState = {
	keyword: '',
	onlyMine: false,
};

const normalize = (value: string) => value.trim().toLowerCase();

const QuanLyCongViecNhomPage: React.FC = () => {
	const [users, setUsers] = useState<QLCVNUser[]>([]);
	const [tasks, setTasks] = useState<QLCVNTask[]>([]);
	const [session, setSession] = useState<AuthSession | null>(null);
	const [filters, setFilters] = useState<TaskFiltersState>(DEFAULT_FILTERS);
	const [taskModalVisible, setTaskModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<QLCVNTask>();

	useEffect(() => {
		const initialUsers = loadUsers();
		const initialTasks = loadTasks();
		const initialSession = loadAuthSession();
		setUsers(initialUsers);
		setTasks(initialTasks);
		if (initialSession && initialUsers.some((item) => item.id === initialSession.userId)) {
			setSession(initialSession);
		} else {
			clearAuthSession();
		}
	}, []);

	const currentUser = useMemo(() => users.find((user) => user.id === session?.userId), [users, session]);

	const persistUsers = (nextUsers: QLCVNUser[]) => {
		setUsers(nextUsers);
		saveUsers(nextUsers);
	};

	const persistTasks = (nextTasks: QLCVNTask[]) => {
		setTasks(nextTasks);
		saveTasks(nextTasks);
	};

	const handleLogin = ({
		username,
		password,
		rememberMe,
	}: {
		username: string;
		password: string;
		rememberMe: boolean;
	}) => {
		const matchedUser = users.find((item) => normalize(item.name) === normalize(username));
		if (!matchedUser) {
			message.error('Không tìm thấy user. Vui lòng tạo user trước khi đăng nhập.');
			return;
		}
		if (matchedUser.password !== password) {
			message.error('Mật khẩu không đúng. Vui lòng thử lại.');
			return;
		}
		const nextSession: AuthSession = {
			userId: matchedUser.id,
			userName: matchedUser.name,
			rememberMe,
			loggedInAt: new Date().toISOString(),
		};
		saveAuthSession(nextSession);
		setSession(nextSession);
		message.success('Đăng nhập thành công');
	};

	const handleLogout = () => {
		clearAuthSession();
		setSession(null);
		message.success('Đã đăng xuất');
	};

	const handleAddUser = (name: string, password: string) => {
		if (!name || !password) return;
		if (users.some((item) => normalize(item.name) === normalize(name))) {
			message.warning('Tên user đã tồn tại');
			return;
		}
		const nextUsers = [{ id: `u_${Date.now()}`, name, password, createdAt: new Date().toISOString() }, ...users];
		persistUsers(nextUsers);
		message.success('Thêm user thành công');
	};

	const handleUpdateUser = (userId: string, name: string, password?: string) => {
		if (!name) return;
		if (users.some((item) => item.id !== userId && normalize(item.name) === normalize(name))) {
			message.warning('Tên user đã tồn tại');
			return;
		}
		persistUsers(
			users.map((item) =>
				item.id === userId
					? {
							...item,
							name,
							password: password || item.password,
							updatedAt: new Date().toISOString(),
					  }
					: item,
			),
		);
		if (session?.userId === userId) {
			const nextSession = { ...session, userName: name };
			saveAuthSession(nextSession);
			setSession(nextSession);
		}
		message.success('Cập nhật user thành công');
	};

	const handleDeleteUser = (user: QLCVNUser) => {
		if (tasks.some((task) => task.assigneeId === user.id)) {
			message.error('Không thể xóa user đang có công việc được gán. Vui lòng chuyển task trước.');
			return;
		}
		if (session?.userId === user.id) {
			message.error('Không thể xóa user đang đăng nhập. Vui lòng đăng xuất trước.');
			return;
		}
		persistUsers(users.filter((item) => item.id !== user.id));
		message.success('Xóa user thành công');
	};

	const handleSaveTask = (payload: {
		title: string;
		assigneeId: string;
		priority: TaskPriority;
		deadline: string;
		status: TaskStatus;
	}) => {
		if (!users.some((user) => user.id === payload.assigneeId)) {
			message.error('Người được giao không hợp lệ');
			return;
		}
		if (editingTask) {
			persistTasks(
				tasks.map((task) =>
					task.id === editingTask.id
						? {
								...task,
								...payload,
								updatedAt: new Date().toISOString(),
						  }
						: task,
				),
			);
			message.success('Cập nhật công việc thành công');
		} else {
			persistTasks([
				{
					id: `t_${Date.now()}`,
					...payload,
					createdAt: new Date().toISOString(),
				},
				...tasks,
			]);
			message.success('Thêm công việc thành công');
		}
		setEditingTask(undefined);
		setTaskModalVisible(false);
	};

	const handleDeleteTask = (taskId: string) => {
		persistTasks(tasks.filter((task) => task.id !== taskId));
		message.success('Xóa công việc thành công');
	};

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			if (filters.keyword && !normalize(task.title).includes(normalize(filters.keyword))) return false;
			if (filters.status && task.status !== filters.status) return false;
			if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
			if (filters.onlyMine && session?.userId && task.assigneeId !== session.userId) return false;
			if (filters.selectedDate && task.deadline !== filters.selectedDate) return false;
			return true;
		});
	}, [tasks, filters, session]);

	const completedCount = useMemo(() => tasks.filter((task) => task.status === 'DA_XONG').length, [tasks]);

	return (
		<PageContainer>
			<Space direction='vertical' size={16} style={{ width: '100%' }}>
				<LoginPanel currentUser={currentUser} onLogin={handleLogin} onLogout={handleLogout} />

				{!currentUser ? (
					<Alert
						type='info'
						showIcon
						message='Vui lòng đăng nhập để sử dụng đầy đủ chức năng quản lý công việc nhóm.'
					/>
				) : (
					<>
						<TaskStats total={tasks.length} completed={completedCount} />
						<Row gutter={16}>
							<Col xs={24} lg={16}>
								<Card
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
												onDelete={handleDeleteTask}
												onEdit={(task) => {
													setEditingTask(task);
													setTaskModalVisible(true);
												}}
											/>
										)}
									</Space>
								</Card>
							</Col>
							<Col xs={24} lg={8}>
								<Card style={{ marginBottom: 16 }}>
									<UserManager
										users={users}
										currentUserId={session?.userId}
										onAdd={handleAddUser}
										onUpdate={handleUpdateUser}
										onDelete={handleDeleteUser}
									/>
								</Card>
								<TaskCalendar
									tasks={tasks}
									selectedDate={filters.selectedDate}
									onSelectDate={(date) => setFilters((prev) => ({ ...prev, selectedDate: date }))}
								/>
							</Col>
						</Row>
						<TaskForm
							visible={taskModalVisible}
							users={users}
							editingTask={editingTask}
							onCancel={() => {
								setTaskModalVisible(false);
								setEditingTask(undefined);
							}}
							onSubmit={handleSaveTask}
						/>
					</>
				)}
			</Space>
		</PageContainer>
	);
};

export default QuanLyCongViecNhomPage;
