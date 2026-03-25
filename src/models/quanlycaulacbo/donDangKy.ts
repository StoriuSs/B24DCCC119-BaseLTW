import useInitModel from '@/hooks/useInitModel';
import { DonDangKy } from '@/pages/QuanLyCauLacBo/typing';

export default () => {
	return useInitModel<DonDangKy>('api/don-dang-ky', undefined, undefined, '');
};
