import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, message } from 'antd';
import LoginPanel from '@/pages/QuanLyCongViecNhom/components/LoginPanel';
import UserManager from '@/pages/QuanLyCongViecNhom/components/UserManager';
import useQLCVNData from '@/pages/QuanLyCongViecNhom/hooks/useQLCVNData';

const NguoiDungPage: React.FC = () => {
	const { currentUser, users, session, login, logout, addUser, updateUser, deleteUser } = useQLCVNData();

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
				<Alert style={{ marginTop: 16 }} type='warning' showIcon message='Vui lòng đăng nhập để quản lý user.' />
			) : (
				<Card style={{ marginTop: 16 }}>
					<UserManager
						users={users}
						currentUserId={session?.userId}
						onAdd={(name, password) => {
							const result = addUser(name, password);
							if (result.success) message.success(result.message);
							else message.error(result.message);
						}}
						onUpdate={(userId, name, password) => {
							const result = updateUser(userId, name, password);
							if (result.success) message.success(result.message);
							else message.error(result.message);
						}}
						onDelete={(user) => {
							const result = deleteUser(user);
							if (result.success) message.success(result.message);
							else message.error(result.message);
						}}
					/>
				</Card>
			)}
		</PageContainer>
	);
};

export default NguoiDungPage;
