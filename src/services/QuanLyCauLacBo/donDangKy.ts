import axios from '@/utils/axios';

const API_URI = '/api/don-dang-ky';

export const duyetDonDangKy = (data: { ids: string[]; hanhDong: 'Approved' | 'Rejected'; lyDo?: string }) =>
	axios.put(`${API_URI}/duyet`, data);

export const getLichSuDonDangKy = (id: string) => axios.get(`${API_URI}/${id}/lich-su`);
