import React, { useEffect, useState } from 'react';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { IColumn } from '@/components/Table/typing';
import { DonDangKy } from '@/pages/QuanLyCauLacBo/typing';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';
import ModalChuyenCLB from './ModalChuyenCLB';
import { Button, Select, message, Row, Col } from 'antd';
import { useLocation } from 'umi';
import { chuyenThanhVienCLB } from '@/services/QuanLyCauLacBo/thanhVien';

const ThanhVienPage: React.FC = () => {
	const { selectedIds, setSelectedIds, setPage } = useModel('quanlycaulacbo.thanhVien');
	const { getAllModel: getAllCauLacBo } = useModel('quanlycaulacbo.cauLacBo');
	const location = useLocation();

	const [cauLacBoData, setCauLacBoData] = useState<CauLacBo[]>([]);

	const searchParams = new URLSearchParams(location.search);
	const cauLacBoIdFromParams = searchParams.get('cauLacBoId');
	const [selectedCauLacBoId, setSelectedCauLacBoId] = useState<string>(cauLacBoIdFromParams || '');
	const [visibleModal, setVisibleModal] = useState(false);
	const [chuyenLoading, setChuyenLoading] = useState(false);

	useEffect(() => {
		const fetchCauLacBo = async () => {
			try {
				const data = await getAllCauLacBo(false, undefined, undefined, undefined, 'many', false);
				setCauLacBoData(data || []);
			} catch (error) {
				message.error('Lỗi tải danh sách câu lạc bộ');
			}
		};

		fetchCauLacBo();
	}, [getAllCauLacBo]);

	const getCauLacBoName = (id: string) => {
		const clb = cauLacBoData.find((c) => c.id === id);
		return clb ? clb.tenCLB : id;
	};

	const handleChuyenCLB = () => {
		if (selectedIds && selectedIds.length > 0) {
			setVisibleModal(true);
		} else {
			message.error('Vui lòng chọn ít nhất 1 thành viên');
		}
	};

	const handleChuyenCLBConfirm = async (cauLacBoIdMoi: string) => {
		setChuyenLoading(true);
		try {
			await chuyenThanhVienCLB({
				ids: selectedIds,
				cauLacBoIdMoi,
			});
			message.success('Chuyển CLB thành công');
			setVisibleModal(false);
			setSelectedIds(undefined);
		} catch (error) {
			message.error('Có lỗi xảy ra');
		} finally {
			setChuyenLoading(false);
		}
	};

	const tableColumns: IColumn<DonDangKy>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'sdt',
			width: 120,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
			filterType: 'select',
			filterData: [
				{ label: 'Nam', value: 'Nam' },
				{ label: 'Nữ', value: 'Nữ' },
				{ label: 'Khác', value: 'Khác' },
			],
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 200,
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 100,
		},
		{
			title: 'Ngày đăng ký',
			dataIndex: 'ngayDangKy',
			width: 120,
		},
	];

	const customButtons =
		selectedIds && selectedIds.length > 0
			? [
					<Button key='chuyen' type='primary' onClick={handleChuyenCLB}>
						Chuyển CLB cho {selectedIds.length} thành viên
					</Button>,
			  ]
			: [];

	return (
		<>
			<div style={{ marginBottom: 16 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={8}>
						<Select
							style={{ width: '100%' }}
							placeholder='Chọn câu lạc bộ'
							value={selectedCauLacBoId || undefined}
							onChange={(value) => {
								setSelectedCauLacBoId(value);
								setSelectedIds(undefined);
								setPage(1);
							}}
						>
							<Select.Option value=''>Tất cả CLB</Select.Option>
							{cauLacBoData.map((clb) => (
								<Select.Option key={clb.id} value={clb.id}>
									{clb.tenCLB}
								</Select.Option>
							))}
						</Select>
					</Col>
				</Row>
			</div>

			<TableBase
				title={`Quản lý thành viên${selectedCauLacBoId ? ` - ${getCauLacBoName(selectedCauLacBoId)}` : ''}`}
				modelName='quanlycaulacbo.thanhVien'
				columns={tableColumns}
				buttons={{ create: false, filter: false }}
				rowSelection
				otherButtons={customButtons}
				params={{ cauLacBoId: selectedCauLacBoId || undefined }}
				dependencies={[selectedCauLacBoId]}
			/>

			<ModalChuyenCLB
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				onOk={handleChuyenCLBConfirm}
				count={selectedIds ? selectedIds.length : 0}
				currentCauLacBoId={selectedCauLacBoId}
				loading={chuyenLoading}
			/>
		</>
	);
};

export default ThanhVienPage;
