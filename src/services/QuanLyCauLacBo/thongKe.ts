import axios from '@/utils/axios';

export const getTongQuanThongKe = () => axios.get('/api/thong-ke/tong-quan');

export const getDonTheoCauLacBo = () => axios.get('/api/thong-ke/don-theo-clb');
