import axios from '@/utils/axios';

export const getTongQuanNganSach = () => axios.get('/api/du-lich/ngan-sach/tong-quan');
export const getThongKeAdminDuLich = () => axios.get('/api/du-lich/admin/thong-ke');
