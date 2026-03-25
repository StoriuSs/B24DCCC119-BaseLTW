import React, { useEffect, useState } from 'react';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { IColumn } from '@/components/Table/typing';
import { DonDangKy } from '@/pages/QuanLyCauLacBo/typing';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';
import FormDonDangKy from './FormDonDangKy';
import ModalDuyet from './ModalDuyet';
import ModalLichSu from './ModalLichSu';
import { Button, Popconfirm, Space, Tag, Tooltip, message } from 'antd';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import { duyetDonDangKy } from '@/services/QuanLyCauLacBo/donDangKy';

const DonDangKyPage: React.FC = () => {
	const { setVisibleForm, deleteModel, getModel, selectedIds, setSelectedIds, setIsView, setRecord, setEdit } =
		useModel('quanlycaulacbo.donDangKy');

	const { getAllModel: getAllCauLacBo } = useModel('quanlycaulacbo.cauLacBo');

	const [visibleModal, setVisibleModal] = useState(false);
	const [visibleLichSu, setVisibleLichSu] = useState(false);
	const [modalType, setModalType] = useState<'Approved' | 'Rejected'>('Approved');
	const [lichSuData, setLichSuData] = useState<any[]>([]);
	const [duyetLoading, setDuyetLoading] = useState(false);
	const [appliedIds, setAppliedIds] = useState<string[]>([]);
	const [cauLacBoData, setCauLacBoData] = useState<CauLacBo[]>([]);

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

	const handleView = (record: DonDangKy) => {
		setRecord(record);
		setIsView(true);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleDuyetMotDon = (record: DonDangKy) => {
		setAppliedIds([record._id || '']);
		setModalType('Approved');
		setVisibleModal(true);
	};

	const handleTuChoiMotDon = (record: DonDangKy) => {
		setAppliedIds([record._id || '']);
		setModalType('Rejected');
		setVisibleModal(true);
	};

	const handleXemLichSu = (record: DonDangKy) => {
		setLichSuData(record.lichSu);
		setVisibleLichSu(true);
	};

	const handleModalOk = async (lyDo?: string) => {
		setDuyetLoading(true);
		try {
			const ids = appliedIds.length > 0 ? appliedIds : selectedIds || [];
			if (ids.length === 0) {
				message.error('Vui lòng chọn đơn');
				setDuyetLoading(false);
				return;
			}

			await duyetDonDangKy({
				ids,
				hanhDong: modalType,
				lyDo: lyDo || '',
			});
			await getModel();
			message.success(modalType === 'Approved' ? 'Duyệt thành công' : 'Từ chối thành công');
			setVisibleModal(false);
			setAppliedIds([]);
			setSelectedIds(undefined);
		} catch (error) {
			message.error('Có lỗi xảy ra');
		} finally {
			setDuyetLoading(false);
		}
	};

	const handleDuyetNhieu = () => {
		if (selectedIds && selectedIds.length > 0) {
			setAppliedIds([]);
			setModalType('Approved');
			setVisibleModal(true);
		} else {
			message.error('Vui lòng chọn ít nhất 1 đơn');
		}
	};

	const handleTuChoiNhieu = () => {
		if (selectedIds && selectedIds.length > 0) {
			setAppliedIds([]);
			setModalType('Rejected');
			setVisibleModal(true);
		} else {
			message.error('Vui lòng chọn ít nhất 1 đơn');
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
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 200,
			render: (cauLacBoId: string) => getCauLacBoName(cauLacBoId),
			filterType: 'select',
			filterData: cauLacBoData.map((clb) => ({ label: clb.tenCLB, value: clb.id })),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			filterType: 'select',
			filterData: [
				{ label: 'Pending', value: 'Pending' },
				{ label: 'Approved', value: 'Approved' },
				{ label: 'Rejected', value: 'Rejected' },
			],
			render: (trangThai: string) => {
				let color = 'default';
				if (trangThai === 'Pending') color = 'orange';
				else if (trangThai === 'Approved') color = 'green';
				else if (trangThai === 'Rejected') color = 'red';
				return <Tag color={color}>{trangThai}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			width: 320,
			render: (_, record: DonDangKy) => (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Space size={4} wrap>
						<Tooltip title='Xem chi tiết'>
							<Button type='link' size='small' icon={<EyeOutlined />} onClick={() => handleView(record)}>
								Xem
							</Button>
						</Tooltip>
						<Button
							type='link'
							size='small'
							icon={<EditOutlined />}
							onClick={() => {
								setRecord(record);
								setIsView(false);
								setEdit(true);
								setVisibleForm(true);
							}}
						>
							Sửa
						</Button>
						<Popconfirm title='Bạn có chắc chắn muốn xóa đơn này?' onConfirm={() => deleteModel(record._id || '')}>
							<Button type='link' size='small' danger icon={<DeleteOutlined />}>
								Xóa
							</Button>
						</Popconfirm>
					</Space>

					<Space size={4} wrap>
						{record.trangThai === 'Pending' && (
							<>
								<Button type='link' size='small' icon={<CheckOutlined />} onClick={() => handleDuyetMotDon(record)}>
									Duyệt
								</Button>
								<Button
									type='link'
									size='small'
									danger
									icon={<CloseOutlined />}
									onClick={() => handleTuChoiMotDon(record)}
								>
									Từ chối
								</Button>
							</>
						)}
						{record.lichSu && record.lichSu.length > 0 && (
							<Button type='link' size='small' icon={<HistoryOutlined />} onClick={() => handleXemLichSu(record)}>
								Lịch sử
							</Button>
						)}
					</Space>
				</div>
			),
		},
	];

	const customButtons =
		selectedIds && selectedIds.length > 0
			? [
					<Button key='duyet' type='primary' onClick={handleDuyetNhieu}>
						Duyệt {selectedIds.length} đơn
					</Button>,
					<Button key='tuchoi' danger onClick={handleTuChoiNhieu}>
						Từ chối {selectedIds.length} đơn
					</Button>,
			  ]
			: [];

	return (
		<>
			<TableBase
				title='Quản lý đơn đăng ký'
				modelName='quanlycaulacbo.donDangKy'
				columns={tableColumns}
				Form={FormDonDangKy}
				rowSelection
				otherButtons={customButtons}
			/>

			<ModalDuyet
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				onOk={handleModalOk}
				type={modalType}
				count={appliedIds.length > 0 ? appliedIds.length : selectedIds ? selectedIds.length : 0}
				loading={duyetLoading}
			/>

			<ModalLichSu visible={visibleLichSu} onCancel={() => setVisibleLichSu(false)} lichSu={lichSuData} />
		</>
	);
};

export default DonDangKyPage;
