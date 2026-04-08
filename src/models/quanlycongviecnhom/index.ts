import { useMemo } from 'react';
import {
	clearAuthSession,
	loadAuthSession,
	loadTasks,
	loadUsers,
	saveAuthSession,
	saveTasks,
	saveUsers,
} from '@/pages/QuanLyCongViecNhom/utils/storage';

// Model mỏng để chuẩn hóa điểm truy cập storage cho module Quản lý Công việc Nhóm.
export default () => {
	return useMemo(
		() => ({
			loadUsers,
			saveUsers,
			loadTasks,
			saveTasks,
			loadAuthSession,
			saveAuthSession,
			clearAuthSession,
		}),
		[],
	);
};
