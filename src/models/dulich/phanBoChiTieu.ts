import useInitModel from '@/hooks/useInitModel';
import { CauHinhPhanBoChiTieu } from '@/pages/DuLich/typing';

export default () => {
	return useInitModel<CauHinhPhanBoChiTieu>('api/du-lich/phan-bo-chi-tieu', undefined, undefined, '');
};
