import axios from '@/utils/axios';

const API_URI = '/api/du-lich/lich-trinh';

export const getLichTrinh = (params?: any) => axios.get(`${API_URI}/page`, { params });
export const getTatCaLichTrinh = (params?: any) => axios.get(`${API_URI}/many`, { params });
export const postMucLichTrinh = (data: any) => axios.post(API_URI, data);
export const putMucLichTrinh = (id: string, data: any) => axios.put(`${API_URI}/${id}`, data);
export const deleteMucLichTrinh = (id: string) => axios.delete(`${API_URI}/${id}`);
