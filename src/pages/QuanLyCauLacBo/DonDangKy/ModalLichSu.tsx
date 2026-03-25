import React from 'react';
import { Modal, Timeline, Empty } from 'antd';
import { LichSuThaoTac } from '@/pages/QuanLyCauLacBo/typing';
import moment from 'moment';

interface ModalLichSuProps {
	visible: boolean;
	onCancel: () => void;
	lichSu: LichSuThaoTac[];
}

const ModalLichSu: React.FC<ModalLichSuProps> = ({ visible, onCancel, lichSu }) => {
	return (
		<Modal title='Lịch sử thao tác' visible={visible} onCancel={onCancel} footer={null} width={600}>
			{lichSu && lichSu.length > 0 ? (
				<Timeline>
					{lichSu.map((item) => (
						<Timeline.Item
							key={`${item.thoiGian}-${item.hanhDong}-${item.nguoiThucHien}`}
							color={item.hanhDong === 'Approved' ? 'green' : 'red'}
						>
							<div>
								<p style={{ marginBottom: 4 }}>
									<strong>
										{item.hanhDong === 'Approved' ? '✓ Duyệt' : '✗ Từ chối'} - {item.nguoiThucHien}
									</strong>
								</p>
								<p style={{ marginBottom: 4, fontSize: 12, color: '#999' }}>
									{moment(item.thoiGian).format('HH:mm:ss DD/MM/YYYY')}
								</p>
								{item.lyDo && <p style={{ marginBottom: 0 }}>Lý do: {item.lyDo}</p>}
							</div>
						</Timeline.Item>
					))}
				</Timeline>
			) : (
				<Empty description='Chưa có lịch sử' />
			)}
		</Modal>
	);
};

export default ModalLichSu;
