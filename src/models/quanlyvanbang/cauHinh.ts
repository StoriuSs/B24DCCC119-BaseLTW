import useInitModel from '@/hooks/useInitModel';
import { CauHinhBieuMau } from '@/pages/QuanLyVanBang/typing';

export default () => {
	return useInitModel<CauHinhBieuMau>('api/cau-hinh', undefined, undefined, '');
};
