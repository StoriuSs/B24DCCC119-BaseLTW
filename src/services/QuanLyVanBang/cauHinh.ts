import axios from '@/utils/axios';

const API_URI = '/api/cau-hinh';

export const getCauHinh = (params?: any) => axios.get(API_URI, { params });
export const postCauHinh = (data: any) => axios.post(API_URI, data);
export const putCauHinh = (id: string, data: any) => axios.put(`${API_URI}/${id}`, data);
export const deleteCauHinh = (id: string) => axios.delete(`${API_URI}/${id}`);
