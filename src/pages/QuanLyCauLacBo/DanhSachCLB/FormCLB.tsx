import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Switch, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TinyEditor from '@/components/TinyEditor';
import moment from 'moment';
import { CauLacBo } from '@/pages/QuanLyCauLacBo/typing';
import { useModel } from 'umi';

const FormCLB: React.FC = () => {
	const { record, edit, setVisibleForm, postModel, putModel, formSubmiting } = useModel('quanlycaulacbo.cauLacBo');
	const [form] = Form.useForm();
	const [moTa, setMoTa] = React.useState<string>('');
	const [imageUrl, setImageUrl] = React.useState<string>('');

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({
				tenCLB: record.tenCLB,
				ngayThanhLap: record.ngayThanhLap ? moment(record.ngayThanhLap) : null,
				chuNhiem: record.chuNhiem,
				hoatDong: record.hoatDong,
			});
			setMoTa(record.moTa);
			setImageUrl(record.anhDaiDien || '');
		} else {
			form.resetFields();
			setMoTa('');
			setImageUrl('');
		}
	}, [edit, form, record]);

	const handleSubmit = async (values: any) => {
		const recordId = (record as CauLacBo | undefined)?._id;
		const submitData = {
			...values,
			moTa,
			anhDaiDien: imageUrl,
			ngayThanhLap: values.ngayThanhLap?.format('YYYY-MM-DD') || '',
		};

		if (edit && recordId) {
			await putModel(recordId, submitData);
		} else {
			await postModel(submitData);
		}
		setVisibleForm(false);
	};

	const handleUpload = (file: any) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			setImageUrl(e.target?.result as string);
		};
		return false;
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} style={{ padding: 24 }}>
			<Form.Item name='tenCLB' label='Tên câu lạc bộ' rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
				<Input placeholder='VD: Câu lạc bộ Lập trình' />
			</Form.Item>

			<Form.Item name='ngayThanhLap' label='Ngày thành lập' rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
				<DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
			</Form.Item>

			<Form.Item name='chuNhiem' label='Chủ nhiệm CLB' rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm' }]}>
				<Input placeholder='VD: Lê Thị Minh Châu' />
			</Form.Item>

			<Form.Item label='Ảnh đại diện'>
				<Space>
					<Upload beforeUpload={handleUpload} maxCount={1}>
						<Button icon={<UploadOutlined />}>Chọn ảnh</Button>
					</Upload>
					{imageUrl && <img src={imageUrl} alt='avatar' style={{ maxWidth: 100, maxHeight: 100 }} />}
				</Space>
			</Form.Item>

			<Form.Item label='Mô tả (HTML)'>
				<TinyEditor value={moTa} onChange={(content: string) => setMoTa(content)} height={250} minHeight={120} />
			</Form.Item>

			<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked' initialValue={true}>
				<Switch checkedChildren='Có' unCheckedChildren='Không' />
			</Form.Item>

			<div style={{ textAlign: 'right' }}>
				<Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>
					Hủy
				</Button>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{edit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</div>
		</Form>
	);
};

export default FormCLB;
