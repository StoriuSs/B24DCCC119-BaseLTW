import useInitModel from '@/hooks/useInitModel';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';

export default () => {
	return useInitModel<CauLacBo>('api/cau-lac-bo', undefined, undefined, '');
};
