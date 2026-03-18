import useInitModel from '@/hooks/useInitModel';
import { SoVanBang } from '@/pages/QuanLyVanBang/typing';

export default () => {
  return useInitModel<SoVanBang>('api/so-van-bang', undefined, undefined, '');
};
