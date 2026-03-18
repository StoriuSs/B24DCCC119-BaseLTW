import axios from '@/utils/axios';

const API_URI = '/api/thong-tin-van-bang';

export const getThongTinVanBang = (params?: any) => axios.get(API_URI, { params });
export const postThongTinVanBang = (data: any) => axios.post(API_URI, data);
export const putThongTinVanBang = (id: string, data: any) => axios.put(`${API_URI}/${id}`, data);
export const deleteThongTinVanBang = (id: string) => axios.delete(`${API_URI}/${id}`);

export const traCuuVanBang = (params: any) => axios.get('/api/tra-cuu', { params });
