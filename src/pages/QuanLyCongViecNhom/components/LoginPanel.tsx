import React from 'react';
import { Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd';
import { QLCVNUser } from '@/pages/QuanLyCongViecNhom/typing';

interface LoginPanelProps {
	currentUser?: QLCVNUser;
	onLogin: (payload: { username: string; password: string; rememberMe: boolean }) => void;
	onLogout: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ currentUser, onLogin, onLogout }) => {
	const [form] = Form.useForm();

	if (currentUser) {
		return (
			<Card size='small'>
				<Space style={{ width: '100%', justifyContent: 'space-between' }}>
					<Typography.Text>
						Đang đăng nhập: <Typography.Text strong>{currentUser.name}</Typography.Text>
					</Typography.Text>
					<Button onClick={onLogout}>Đăng xuất</Button>
				</Space>
			</Card>
		);
	}

	return (
		<Card size='small' title='Đăng nhập'>
			<Form
				form={form}
				layout='inline'
				onFinish={(values: { username: string; password: string; rememberMe?: boolean }) =>
					onLogin({ username: values.username, password: values.password, rememberMe: !!values.rememberMe })
				}
			>
				<Form.Item
					name='username'
					rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
					style={{ minWidth: 220 }}
				>
					<Input placeholder='Nhập tên người dùng đã có trong danh sách user' allowClear />
				</Form.Item>
				<Form.Item
					name='password'
					rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
					style={{ minWidth: 180 }}
				>
					<Input.Password placeholder='Nhập mật khẩu' />
				</Form.Item>
				<Form.Item name='rememberMe' valuePropName='checked'>
					<Checkbox>Ghi nhớ đăng nhập</Checkbox>
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Đăng nhập
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default LoginPanel;
