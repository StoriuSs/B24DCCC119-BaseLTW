import useInitModel from '@/hooks/useInitModel';
import { MucLichTrinh } from '@/pages/DuLich/typing';

export default () => {
	return useInitModel<MucLichTrinh>('api/du-lich/lich-trinh', undefined, undefined, '');
};
