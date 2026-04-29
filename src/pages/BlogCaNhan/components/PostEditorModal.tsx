import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { BlogPost, BlogPostInput, BlogTag, BLOG_POST_STATUS_OPTIONS } from '@/services/blogCaNhan/typing';
import { slugify } from '@/services/blogCaNhan/utils';

type PostEditorModalProps = {
	visible: boolean;
	editingPost?: BlogPost;
	tags: BlogTag[];
	onCancel: () => void;
	onSubmit: (payload: BlogPostInput) => void;
};

const PostEditorModal: React.FC<PostEditorModalProps> = ({ visible, editingPost, tags, onCancel, onSubmit }) => {
	const [form] = Form.useForm<BlogPostInput>();
	const [slugTouched, setSlugTouched] = useState(false);

	useEffect(() => {
		if (!visible) return;
		setSlugTouched(Boolean(editingPost && editingPost.slug !== slugify(editingPost.title)));
		form.setFieldsValue(
			editingPost
				? {
						title: editingPost.title,
						slug: editingPost.slug,
						excerpt: editingPost.excerpt,
						content: editingPost.content,
						coverImage: editingPost.coverImage,
						status: editingPost.status,
						tagIds: editingPost.tagIds,
				  }
				: {
						title: '',
						slug: '',
						excerpt: '',
						content: '',
						coverImage: '',
						status: 'draft',
						tagIds: [],
				  },
		);
	}, [editingPost, form, visible]);

	const tagOptions = useMemo(() => tags.map((tag) => ({ label: tag.name, value: tag.id })), [tags]);

	return (
		<Modal
			destroyOnClose
			forceRender
			title={editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			width={920}
		>
			<Form
				form={form}
				layout='vertical'
				onValuesChange={(changedValues, allValues) => {
					if (Object.prototype.hasOwnProperty.call(changedValues, 'title') && !slugTouched) {
						form.setFieldsValue({ slug: slugify(String(allValues.title || '')) });
					}
					if (Object.prototype.hasOwnProperty.call(changedValues, 'slug')) {
						setSlugTouched(true);
					}
				}}
				onFinish={(values) => onSubmit(values)}
			>
				<Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Nhập tiêu đề bài viết' }]}>
					<Input placeholder='Ví dụ: Học React từ bài tập thực hành' />
				</Form.Item>
				<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Nhập slug bài viết' }]}>
					<Input
						placeholder='slug-bai-viet'
						addonAfter={
							<Button
								type='link'
								size='small'
								onClick={() => form.setFieldsValue({ slug: slugify(String(form.getFieldValue('title') || '')) })}
							>
								Tự sinh
							</Button>
						}
					/>
				</Form.Item>
				<Form.Item name='excerpt' label='Mô tả ngắn' rules={[{ required: true, message: 'Nhập mô tả ngắn' }]}>
					<Input.TextArea rows={3} placeholder='Tóm tắt ngắn gọn nội dung bài viết' />
				</Form.Item>
				<Form.Item
					name='content'
					label='Nội dung Markdown'
					rules={[{ required: true, message: 'Nhập nội dung bài viết' }]}
				>
					<Input.TextArea rows={10} placeholder='# Tiêu đề\n\nNội dung bài viết...' />
				</Form.Item>
				<Form.Item name='coverImage' label='Ảnh bìa (không bắt buộc)'>
					<Input placeholder='https://...' />
				</Form.Item>
				<Form.Item name='tagIds' label='Thẻ'>
					<Select mode='multiple' allowClear placeholder='Chọn thẻ' options={tagOptions} />
				</Form.Item>
				<Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
					<Select options={BLOG_POST_STATUS_OPTIONS.map((item) => ({ label: item.label, value: item.value }))} />
				</Form.Item>
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<Button onClick={onCancel}>Hủy</Button>
					<Button type='primary' htmlType='submit'>
						Lưu bài viết
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default PostEditorModal;
