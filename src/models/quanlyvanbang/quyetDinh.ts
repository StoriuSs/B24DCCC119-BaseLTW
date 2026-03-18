import useInitModel from '@/hooks/useInitModel';
import { QuyetDinhTotNghiep } from '@/pages/QuanLyVanBang/typing';

export default () => {
  return useInitModel<QuyetDinhTotNghiep>('api/quyet-dinh', undefined, undefined, '');
};
