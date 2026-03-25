import useInitModel from '@/hooks/useInitModel';
import { DonDangKy } from '@/pages/QuanLyCauLacBo/typing';

export default () => {
	return useInitModel<DonDangKy>('api/thanh-vien', undefined, undefined, '');
};
