import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, Typography, message } from 'antd';
import LoginPanel from '@/pages/QuanLyCongViecNhom/components/LoginPanel';
import useQLCVNData from '@/pages/QuanLyCongViecNhom/hooks/useQLCVNData';

const DangNhapPage: React.FC = () => {
	const { currentUser, login, logout } = useQLCVNData();

	return (
		<PageContainer>
			<LoginPanel
				currentUser={currentUser}
				onLogin={(payload) => {
					const result = login(payload);
					if (result.success) message.success(result.message);
					else message.error(result.message);
				}}
				onLogout={() => {
					message.success(logout().message);
				}}
			/>
			<Card style={{ marginTop: 16 }}>
				<Alert
					type='info'
					showIcon
					message='User mock mặc định'
					description='Nguyen Van An / 123456, Tran Thi Binh / 123456, Le Quang Huy / 123456'
				/>
				<Typography.Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
					Sau khi đăng nhập, bạn có thể chuyển sang các trang con: Quản lý công việc, Quản lý user, Lịch & thống kê.
				</Typography.Paragraph>
			</Card>
		</PageContainer>
	);
};

export default DangNhapPage;
