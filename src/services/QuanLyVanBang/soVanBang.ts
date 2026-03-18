import axios from '@/utils/axios';

const API_URI = '/api/so-van-bang';

export const getSoVanBang = (params?: any) => axios.get(API_URI, { params });
export const postSoVanBang = (data: any) => axios.post(API_URI, data);
export const putSoVanBang = (id: string, data: any) => axios.put(`${API_URI}/${id}`, data);
export const deleteSoVanBang = (id: string) => axios.delete(`${API_URI}/${id}`);
