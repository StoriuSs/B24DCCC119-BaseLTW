import { message } from 'antd';
import { useState } from 'react';
import { createDichVu, deleteDichVu, getDichVus, updateDichVu } from '@/services/DatLich/dichvu';

export default () => {
	const [danhSach, setDanhSach] = useState<DatLich.DichVu[]>([]);
	const [loading, setLoading] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [record, setRecord] = useState<DatLich.DichVu>();
	const [isEdit, setIsEdit] = useState(false);

	const getData = () => {
		setLoading(true);
		try {
			setDanhSach(getDichVus());
		} finally {
			setLoading(false);
		}
	};

	const submit = (payload: Omit<DatLich.DichVu, '_id'>) => {
		try {
			if (isEdit && record?._id) {
				updateDichVu(record._id, payload);
				message.success('Cập nhật dịch vụ thành công');
			} else {
				createDichVu(payload);
				message.success('Thêm dịch vụ thành công');
			}
			setVisibleForm(false);
			getData();
		} catch (e: any) {
			message.error(e.message);
		}
	};

	const remove = (id: string) => {
		deleteDichVu(id);
		message.success('Xóa dịch vụ thành công');
		getData();
	};

	return {
		danhSach,
		loading,
		visibleForm,
		setVisibleForm,
		record,
		setRecord,
		isEdit,
		setIsEdit,
		getData,
		submit,
		remove,
	};
};
