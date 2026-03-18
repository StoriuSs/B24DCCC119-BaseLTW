import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Descriptions, Empty, message, Modal, Table } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ThongTinVanBang } from '@/pages/QuanLyVanBang/typing';
import { traCuuVanBang } from '@/services/QuanLyVanBang/thongTin';
import moment from 'moment';

const TraCuuPage: React.FC = () => {
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<ThongTinVanBang[]>([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [activeRecord, setActiveRecord] = useState<any>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const cauHinhStoreModel = useModel('quanlyvanbang.cauHinh');
	const quyetDinhStoreModel = useModel('quanlyvanbang.quyetDinh');

	useEffect(() => {
		cauHinhStoreModel.getAllModel();
		quyetDinhStoreModel.getAllModel();
	}, []);

	const handleSearch = async (values: any) => {
		const searchPayload: any = {};
		Object.entries(values).forEach(([key, val]) => {
			if (val !== undefined && val !== '') searchPayload[key] = val;
		});

		if (Object.keys(searchPayload).length < 2) {
			message.warning('Vui lòng nhập ít nhất 2 tham số để tra cứu!');
			return;
		}

		setIsSearching(true);
		setHasSearched(true);
		try {
			const response = await traCuuVanBang(searchPayload);
			setSearchResults(response?.data?.data || []);
		} catch (error: any) {
			message.error(error?.response?.data?.message || 'Lỗi tra cứu');
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const getQuyetDinhInfo = (quyetDinhId: string) => {
		return quyetDinhStoreModel.danhSach.find((item: any) => (item._id || item.id) === quyetDinhId);
	};

	const resultColumns = [
		{ title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', width: 150 },
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', align: 'center' as const, width: 100 },
		{ title: 'MSV', dataIndex: 'maSinhVien', width: 120 },
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 200 },
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 120,
			render: (val: any) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			width: 150,
			render: (val: any) => getQuyetDinhInfo(val)?.soSQ || '-',
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center' as const,
			render: (_: any, record: any) => (
				<Button
					type='link'
					icon={<EyeOutlined />}
					onClick={() => {
						setActiveRecord(record);
						setShowDetailModal(true);
					}}
				>
					Chi tiết
				</Button>
			),
		},
	];

	return (
		<div
			style={{
				padding: 24,
				background: 'linear-gradient(180deg, #f5f8ff 0%, #ffffff 45%)',
				borderRadius: 12,
			}}
		>
			<Card
				title='Tra cứu thông tin văn bằng'
				style={{ maxWidth: 920, margin: '0 auto', borderRadius: 12 }}
				bodyStyle={{ paddingBottom: 12 }}
			>
				<p style={{ color: '#d48806', marginBottom: 20 }}>* Nhập ít nhất 2 tham số để tìm kiếm</p>
				<Form layout='vertical' onFinish={handleSearch}>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
						<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng'>
							<Input placeholder='Nhập số hiệu văn bằng' />
						</Form.Item>
						<Form.Item name='soVaoSo' label='Số vào sổ'>
							<Input placeholder='Nhập số vào sổ' />
						</Form.Item>
						<Form.Item name='maSinhVien' label='Mã sinh viên'>
							<Input placeholder='Nhập mã sinh viên' />
						</Form.Item>
						<Form.Item name='hoTen' label='Họ và tên'>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
						<Form.Item name='ngaySinh' label='Ngày sinh'>
							<Input placeholder='Nhập ngày sinh (VD: 2001)' />
						</Form.Item>
					</div>
					<Form.Item style={{ textAlign: 'center', marginTop: 16 }}>
						<Button type='primary' icon={<SearchOutlined />} htmlType='submit' loading={isSearching} size='large'>
							Tra cứu
						</Button>
					</Form.Item>
				</Form>
			</Card>

			{hasSearched && (
				<Card title={`Kết quả tra cứu (${searchResults.length} bản ghi)`} style={{ marginTop: 24, borderRadius: 12 }}>
					{searchResults.length > 0 ? (
						<Table
							dataSource={searchResults}
							columns={resultColumns}
							rowKey={(r: any) => r._id || r.id}
							pagination={{ pageSize: 10 }}
							scroll={{ x: 900 }}
						/>
					) : (
						<Empty description='Không có kết quả nào được tìm thấy' />
					)}
				</Card>
			)}

			<Modal
				title='Chi tiết văn bằng'
				visible={showDetailModal}
				onCancel={() => setShowDetailModal(false)}
				footer={<Button onClick={() => setShowDetailModal(false)}>Đóng</Button>}
				width={700}
			>
				{activeRecord &&
					(() => {
						const qd = getQuyetDinhInfo(activeRecord.quyetDinhId);
						return (
							<Descriptions bordered column={2}>
								<Descriptions.Item label='Họ tên'>{activeRecord.hoTen}</Descriptions.Item>
								<Descriptions.Item label='Mã sinh viên'>{activeRecord.maSinhVien}</Descriptions.Item>
								<Descriptions.Item label='Số hiệu văn bằng'>{activeRecord.soHieuVanBang}</Descriptions.Item>
								<Descriptions.Item label='Số vào sổ'>{activeRecord.soVaoSo}</Descriptions.Item>
								<Descriptions.Item label='Ngày sinh'>
									{activeRecord.ngaySinh ? moment(activeRecord.ngaySinh).format('DD/MM/YYYY') : '-'}
								</Descriptions.Item>
								<Descriptions.Item label='Số quyết định'>{qd?.soSQ || '-'}</Descriptions.Item>
								<Descriptions.Item label='Ngày ban hành QĐ'>
									{qd?.ngayBanHanh ? moment(qd.ngayBanHanh).format('DD/MM/YYYY') : '-'}
								</Descriptions.Item>
								<Descriptions.Item label='Trích yếu'>{qd?.trichYeu || '-'}</Descriptions.Item>
								{cauHinhStoreModel.danhSach.map((ch: any) => (
									<Descriptions.Item key={ch._id || ch.id} label={ch.tenTruong}>
										{ch.kieuDuLieu === 'Date'
											? activeRecord.extraFields?.[ch.maTruong]
												? moment(activeRecord.extraFields[ch.maTruong]).format('DD/MM/YYYY')
												: '-'
											: activeRecord.extraFields?.[ch.maTruong] ?? '-'}
									</Descriptions.Item>
								))}
							</Descriptions>
						);
					})()}
			</Modal>
		</div>
	);
};

export default TraCuuPage;
