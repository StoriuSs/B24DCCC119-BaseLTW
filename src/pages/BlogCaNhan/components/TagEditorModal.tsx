import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { BlogTag, BlogTagInput } from '@/services/blogCaNhan/typing';
import { slugify } from '@/services/blogCaNhan/utils';

type TagEditorModalProps = {
	visible: boolean;
	editingTag?: BlogTag;
	onCancel: () => void;
	onSubmit: (payload: BlogTagInput) => void;
};

const TagEditorModal: React.FC<TagEditorModalProps> = ({ visible, editingTag, onCancel, onSubmit }) => {
	const [form] = Form.useForm<BlogTagInput>();
	const [slugTouched, setSlugTouched] = useState(false);

	useEffect(() => {
		if (!visible) return;
		setSlugTouched(Boolean(editingTag && editingTag.slug !== slugify(editingTag.name)));
		form.setFieldsValue(editingTag ? { name: editingTag.name, slug: editingTag.slug } : { name: '', slug: '' });
	}, [editingTag, form, visible]);

	return (
		<Modal
			destroyOnClose
			forceRender
			title={editingTag ? 'Chỉnh sửa thẻ' : 'Thêm thẻ'}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			width={640}
		>
			<Form
				form={form}
				layout='vertical'
				onValuesChange={(changedValues, allValues) => {
					if (Object.prototype.hasOwnProperty.call(changedValues, 'name') && !slugTouched) {
						form.setFieldsValue({ slug: slugify(String(allValues.name || '')) });
					}
					if (Object.prototype.hasOwnProperty.call(changedValues, 'slug')) {
						setSlugTouched(true);
					}
				}}
				onFinish={onSubmit}
			>
				<Form.Item name='name' label='Tên thẻ' rules={[{ required: true, message: 'Nhập tên thẻ' }]}>
					<Input placeholder='Ví dụ: React' />
				</Form.Item>
				<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Nhập slug thẻ' }]}>
					<Input
						placeholder='react'
						addonAfter={
							<Button
								type='link'
								size='small'
								onClick={() => form.setFieldsValue({ slug: slugify(String(form.getFieldValue('name') || '')) })}
							>
								Tự sinh
							</Button>
						}
					/>
				</Form.Item>
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<Button onClick={onCancel}>Hủy</Button>
					<Button type='primary' htmlType='submit'>
						Lưu thẻ
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default TagEditorModal;
