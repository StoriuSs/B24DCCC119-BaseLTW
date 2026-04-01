import useInitModel from '@/hooks/useInitModel';
import { NguonNganSach } from '@/pages/DuLich/typing';

export default () => {
	return useInitModel<NguonNganSach>('api/du-lich/ngan-sach', undefined, undefined, '');
};
