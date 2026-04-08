import { Request, Response } from 'express';

let users: any[] = [
	{ id: 'u_001', name: 'Nguyen Van An', password: '123456', createdAt: new Date().toISOString() },
	{ id: 'u_002', name: 'Tran Thi Binh', password: '123456', createdAt: new Date().toISOString() },
	{ id: 'u_003', name: 'Le Quang Huy', password: '123456', createdAt: new Date().toISOString() },
];

let tasks: any[] = [];

export default {
	'GET /api/quan-ly-cong-viec-nhom/users': (_req: Request, res: Response) => {
		res.send({ data: users });
	},
	'POST /api/quan-ly-cong-viec-nhom/users': (req: Request, res: Response) => {
		const newUser = { id: `u_${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
		users.unshift(newUser);
		res.send({ data: newUser });
	},
	'PUT /api/quan-ly-cong-viec-nhom/users/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		users = users.map((user) =>
			user.id === id ? { ...user, ...req.body, updatedAt: new Date().toISOString() } : user,
		);
		res.send({ data: users.find((user) => user.id === id) });
	},
	'DELETE /api/quan-ly-cong-viec-nhom/users/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		if (tasks.some((task) => task.assigneeId === id)) {
			res.status(400).send({ message: 'Khong the xoa user dang duoc gan task. Vui long chuyen task truoc.' });
			return;
		}
		users = users.filter((user) => user.id !== id);
		res.send({ data: true });
	},
	'GET /api/quan-ly-cong-viec-nhom/tasks': (_req: Request, res: Response) => {
		res.send({ data: tasks });
	},
	'POST /api/quan-ly-cong-viec-nhom/tasks': (req: Request, res: Response) => {
		const newTask = { id: `t_${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
		tasks.unshift(newTask);
		res.send({ data: newTask });
	},
	'PUT /api/quan-ly-cong-viec-nhom/tasks/:id': (req: Request, res: Response) => {
		const { id } = req.params;
		tasks = tasks.map((task) =>
			task.id === id ? { ...task, ...req.body, updatedAt: new Date().toISOString() } : task,
		);
		res.send({ data: tasks.find((task) => task.id === id) });
	},
	'DELETE /api/quan-ly-cong-viec-nhom/tasks/:id': (req: Request, res: Response) => {
		tasks = tasks.filter((task) => task.id !== req.params.id);
		res.send({ data: true });
	},
};
