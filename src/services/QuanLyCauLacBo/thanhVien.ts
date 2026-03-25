import axios from '@/utils/axios';

const API_URI = '/api/thanh-vien';

export const getThanhVienPage = (params?: any) => axios.get(`${API_URI}/page`, { params });

export const chuyenThanhVienCLB = (data: { ids?: string[]; cauLacBoIdMoi: string }) =>
	axios.put(`${API_URI}/chuyen-clb`, data);
