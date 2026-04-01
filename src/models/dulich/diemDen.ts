import useInitModel from '@/hooks/useInitModel';
import { DiemDen } from '@/pages/DuLich/typing';

export default () => {
	return useInitModel<DiemDen>('api/du-lich/diem-den', undefined, undefined, '');
};
