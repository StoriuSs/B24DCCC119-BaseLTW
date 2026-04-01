import axios from '@/utils/axios';

const API_URI = '/api/du-lich/diem-den';

export const getDiemDen = (params?: any) => axios.get(`${API_URI}/page`, { params });
export const getTatCaDiemDen = (params?: any) => axios.get(`${API_URI}/many`, { params });
export const postDiemDen = (data: any) => axios.post(API_URI, data);
export const putDiemDen = (id: string, data: any) => axios.put(`${API_URI}/${id}`, data);
export const deleteDiemDen = (id: string) => axios.delete(`${API_URI}/${id}`);
