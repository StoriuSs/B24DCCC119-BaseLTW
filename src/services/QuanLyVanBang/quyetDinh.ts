import axios from '@/utils/axios';

const API_URI = '/api/quyet-dinh';

export const getQuyetDinh = (params?: any) => axios.get(API_URI, { params });
export const postQuyetDinh = (data: any) => axios.post(API_URI, data);
export const putQuyetDinh = (id: string, data: any) => axios.put(`${API_URI}/${id}`, data);
export const deleteQuyetDinh = (id: string) => axios.delete(`${API_URI}/${id}`);
