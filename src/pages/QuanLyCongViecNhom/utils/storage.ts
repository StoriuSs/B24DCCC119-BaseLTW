import { AuthSession, QLCVNTask, QLCVNUser } from '@/pages/QuanLyCongViecNhom/typing';

export const STORAGE_KEYS = {
	users: 'qlcvn_users',
	tasks: 'qlcvn_tasks',
	authLocal: 'qlcvn_auth_local',
	authSession: 'qlcvn_auth_session',
};

const DEFAULT_USER_PASSWORD = '123456';

const MOCK_USERS: QLCVNUser[] = [
	{ id: 'u_001', name: 'Nguyen Van An', password: DEFAULT_USER_PASSWORD, createdAt: new Date().toISOString() },
	{ id: 'u_002', name: 'Tran Thi Binh', password: DEFAULT_USER_PASSWORD, createdAt: new Date().toISOString() },
	{ id: 'u_003', name: 'Le Quang Huy', password: DEFAULT_USER_PASSWORD, createdAt: new Date().toISOString() },
];

const safeParse = <T>(value: string | null, fallback: T): T => {
	if (!value) return fallback;
	try {
		return JSON.parse(value) as T;
	} catch (_error) {
		return fallback;
	}
};

const canUseStorage = () => typeof window !== 'undefined';

export const loadUsers = (): QLCVNUser[] => {
	if (!canUseStorage()) return MOCK_USERS;
	const users = safeParse<QLCVNUser[]>(localStorage.getItem(STORAGE_KEYS.users), []);
	if (!users.length) {
		localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(MOCK_USERS));
		return MOCK_USERS;
	}
	const normalizedUsers = users.map((user) => ({
		...user,
		password: user.password || DEFAULT_USER_PASSWORD,
	}));
	const hasMigration = normalizedUsers.some((user, index) => user.password !== users[index].password);
	if (hasMigration) {
		localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(normalizedUsers));
	}
	return normalizedUsers;
};

export const saveUsers = (users: QLCVNUser[]) => {
	if (!canUseStorage()) return;
	localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
};

export const loadTasks = (): QLCVNTask[] => {
	if (!canUseStorage()) return [];
	return safeParse<QLCVNTask[]>(localStorage.getItem(STORAGE_KEYS.tasks), []);
};

export const saveTasks = (tasks: QLCVNTask[]) => {
	if (!canUseStorage()) return;
	localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
};

export const loadAuthSession = (): AuthSession | null => {
	if (!canUseStorage()) return null;
	const localAuth = safeParse<AuthSession | null>(localStorage.getItem(STORAGE_KEYS.authLocal), null);
	if (localAuth) return localAuth;
	return safeParse<AuthSession | null>(sessionStorage.getItem(STORAGE_KEYS.authSession), null);
};

export const saveAuthSession = (session: AuthSession) => {
	if (!canUseStorage()) return;
	sessionStorage.removeItem(STORAGE_KEYS.authSession);
	localStorage.removeItem(STORAGE_KEYS.authLocal);
	if (session.rememberMe) {
		localStorage.setItem(STORAGE_KEYS.authLocal, JSON.stringify(session));
		return;
	}
	sessionStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
};

export const clearAuthSession = () => {
	if (!canUseStorage()) return;
	localStorage.removeItem(STORAGE_KEYS.authLocal);
	sessionStorage.removeItem(STORAGE_KEYS.authSession);
};
