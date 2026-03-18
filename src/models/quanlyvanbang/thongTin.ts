import useInitModel from '@/hooks/useInitModel';
import { ThongTinVanBang } from '@/pages/QuanLyVanBang/typing';

export default () => {
  return useInitModel<ThongTinVanBang>('api/thong-tin-van-bang', undefined, undefined, '');
};
