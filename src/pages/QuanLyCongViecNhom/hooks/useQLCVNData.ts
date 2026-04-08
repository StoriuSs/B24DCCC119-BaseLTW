import { useEffect, useMemo, useState } from 'react';
import { AuthSession, QLCVNTask, QLCVNUser, TaskPriority, TaskStatus } from '@/pages/QuanLyCongViecNhom/typing';
import {
	clearAuthSession,
	loadAuthSession,
	loadTasks,
	loadUsers,
	saveAuthSession,
	saveTasks,
	saveUsers,
} from '@/pages/QuanLyCongViecNhom/utils/storage';

interface ActionResult {
	success: boolean;
	message: string;
}

const normalize = (value: string) => value.trim().toLowerCase();

const useQLCVNData = () => {
	const [users, setUsers] = useState<QLCVNUser[]>([]);
	const [tasks, setTasks] = useState<QLCVNTask[]>([]);
	const [session, setSession] = useState<AuthSession | null>(null);

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
	const completedCount = useMemo(() => tasks.filter((task) => task.status === 'DA_XONG').length, [tasks]);

	const persistUsers = (nextUsers: QLCVNUser[]) => {
		setUsers(nextUsers);
		saveUsers(nextUsers);
	};

	const persistTasks = (nextTasks: QLCVNTask[]) => {
		setTasks(nextTasks);
		saveTasks(nextTasks);
	};

	const login = (payload: { username: string; password: string; rememberMe: boolean }): ActionResult => {
		const matchedUser = users.find((item) => normalize(item.name) === normalize(payload.username));
		if (!matchedUser) {
			return { success: false, message: 'Không tìm thấy user. Vui lòng tạo user trước khi đăng nhập.' };
		}
		if (matchedUser.password !== payload.password) {
			return { success: false, message: 'Mật khẩu không đúng. Vui lòng thử lại.' };
		}
		const nextSession: AuthSession = {
			userId: matchedUser.id,
			userName: matchedUser.name,
			rememberMe: payload.rememberMe,
			loggedInAt: new Date().toISOString(),
		};
		saveAuthSession(nextSession);
		setSession(nextSession);
		return { success: true, message: 'Đăng nhập thành công' };
	};

	const logout = (): ActionResult => {
		clearAuthSession();
		setSession(null);
		return { success: true, message: 'Đã đăng xuất' };
	};

	const addUser = (name: string, password: string): ActionResult => {
		if (!name || !password) return { success: false, message: 'Tên user và mật khẩu là bắt buộc.' };
		if (users.some((item) => normalize(item.name) === normalize(name))) {
			return { success: false, message: 'Tên user đã tồn tại' };
		}
		const nextUsers = [{ id: `u_${Date.now()}`, name, password, createdAt: new Date().toISOString() }, ...users];
		persistUsers(nextUsers);
		return { success: true, message: 'Thêm user thành công' };
	};

	const updateUser = (userId: string, name: string, password?: string): ActionResult => {
		if (!name) return { success: false, message: 'Tên user là bắt buộc.' };
		if (users.some((item) => item.id !== userId && normalize(item.name) === normalize(name))) {
			return { success: false, message: 'Tên user đã tồn tại' };
		}
		persistUsers(
			users.map((item) =>
				item.id === userId
					? { ...item, name, password: password || item.password, updatedAt: new Date().toISOString() }
					: item,
			),
		);
		if (session?.userId === userId) {
			const nextSession = { ...session, userName: name };
			saveAuthSession(nextSession);
			setSession(nextSession);
		}
		return { success: true, message: 'Cập nhật user thành công' };
	};

	const deleteUser = (user: QLCVNUser): ActionResult => {
		if (tasks.some((task) => task.assigneeId === user.id)) {
			return {
				success: false,
				message: 'Không thể xóa user đang có công việc được gán. Vui lòng chuyển task trước.',
			};
		}
		if (session?.userId === user.id) {
			return { success: false, message: 'Không thể xóa user đang đăng nhập. Vui lòng đăng xuất trước.' };
		}
		persistUsers(users.filter((item) => item.id !== user.id));
		return { success: true, message: 'Xóa user thành công' };
	};

	const createTask = (payload: {
		title: string;
		assigneeId: string;
		priority: TaskPriority;
		deadline: string;
		status: TaskStatus;
	}): ActionResult => {
		if (!users.some((user) => user.id === payload.assigneeId)) {
			return { success: false, message: 'Người được giao không hợp lệ' };
		}
		persistTasks([{ id: `t_${Date.now()}`, ...payload, createdAt: new Date().toISOString() }, ...tasks]);
		return { success: true, message: 'Thêm công việc thành công' };
	};

	const updateTask = (
		taskId: string,
		payload: {
			title: string;
			assigneeId: string;
			priority: TaskPriority;
			deadline: string;
			status: TaskStatus;
		},
	): ActionResult => {
		if (!users.some((user) => user.id === payload.assigneeId)) {
			return { success: false, message: 'Người được giao không hợp lệ' };
		}
		persistTasks(
			tasks.map((task) => (task.id === taskId ? { ...task, ...payload, updatedAt: new Date().toISOString() } : task)),
		);
		return { success: true, message: 'Cập nhật công việc thành công' };
	};

	const deleteTask = (taskId: string): ActionResult => {
		persistTasks(tasks.filter((task) => task.id !== taskId));
		return { success: true, message: 'Xóa công việc thành công' };
	};

	return {
		users,
		tasks,
		session,
		currentUser,
		completedCount,
		login,
		logout,
		addUser,
		updateUser,
		deleteUser,
		createTask,
		updateTask,
		deleteTask,
	};
};

export default useQLCVNData;
