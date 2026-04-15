import { AuthSession, QLCVNTask, QLCVNUser } from '@/pages/QuanLyCongViecNhom/typing';
import {
	clearAuthSession,
	loadAuthSession,
	loadTasks,
	loadUsers,
	saveAuthSession,
	saveTasks,
	saveUsers,
} from '@/pages/QuanLyCongViecNhom/utils/storage';

export const getUsers = async (): Promise<QLCVNUser[]> => loadUsers();
export const putUsers = async (users: QLCVNUser[]): Promise<QLCVNUser[]> => {
	saveUsers(users);
	return users;
};

export const getTasks = async (): Promise<QLCVNTask[]> => loadTasks();
export const putTasks = async (tasks: QLCVNTask[]): Promise<QLCVNTask[]> => {
	saveTasks(tasks);
	return tasks;
};

export const getAuthSession = async (): Promise<AuthSession | null> => loadAuthSession();
export const putAuthSession = async (session: AuthSession): Promise<AuthSession> => {
	saveAuthSession(session);
	return session;
};

export const deleteAuthSession = async (): Promise<boolean> => {
	clearAuthSession();
	return true;
};
