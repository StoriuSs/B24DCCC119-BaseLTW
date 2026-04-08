export type TaskPriority = 'THAP' | 'TRUNG_BINH' | 'CAO';

export type TaskStatus = 'CHUA_LAM' | 'DANG_LAM' | 'DA_XONG';

export interface QLCVNUser {
	id: string;
	name: string;
	password: string;
	createdAt: string;
	updatedAt?: string;
}

export interface QLCVNTask {
	id: string;
	title: string;
	assigneeId: string;
	priority: TaskPriority;
	deadline: string;
	status: TaskStatus;
	createdAt: string;
	updatedAt?: string;
}

export interface AuthSession {
	userId: string;
	userName: string;
	rememberMe: boolean;
	loggedInAt: string;
}

export interface TaskFiltersState {
	keyword: string;
	assigneeId?: string;
	status?: TaskStatus;
	onlyMine: boolean;
	selectedDate?: string;
}
