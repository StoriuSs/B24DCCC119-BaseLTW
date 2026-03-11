import { message } from 'antd';
import { useState } from 'react';
import { createNhanVien, deleteNhanVien, getNhanViens, updateNhanVien } from '@/services/DatLich/nhanvien';

export default () => {
	const [danhSach, setDanhSach] = useState<DatLich.NhanVien[]>([]);
	const [loading, setLoading] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [record, setRecord] = useState<DatLich.NhanVien>();
	const [isEdit, setIsEdit] = useState(false);

	const getData = () => {
		setLoading(true);
		try {
			setDanhSach(getNhanViens());
		} finally {
			setLoading(false);
		}
	};

	const submit = (payload: Omit<DatLich.NhanVien, '_id'>) => {
		try {
			if (isEdit && record?._id) {
				updateNhanVien(record._id, payload);
				message.success('Cập nhật nhân viên thành công');
			} else {
				createNhanVien(payload);
				message.success('Thêm nhân viên thành công');
			}
			setVisibleForm(false);
			getData();
		} catch (e: any) {
			message.error(e.message);
		}
	};

	const remove = (id: string) => {
		deleteNhanVien(id);
		message.success('Xóa nhân viên thành công');
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
