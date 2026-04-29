import { Button, Col, Input, Row, Select, Space } from 'antd';
import { BlogPostStatus, BlogTag } from '@/services/blogCaNhan/typing';

type PostFiltersProps = {
	keyword: string;
	tagId?: string;
	status?: BlogPostStatus | 'all';
	tags: BlogTag[];
	onKeywordChange: (value: string) => void;
	onTagChange: (value?: string) => void;
	onStatusChange: (value?: BlogPostStatus | 'all') => void;
	onReset: () => void;
};

const PostFilters: React.FC<PostFiltersProps> = ({
	keyword,
	tagId,
	status,
	tags,
	onKeywordChange,
	onTagChange,
	onStatusChange,
	onReset,
}) => {
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} md={10}>
				<Input.Search
					allowClear
					placeholder='Tìm kiếm theo tiêu đề, slug hoặc nội dung'
					value={keyword}
					onChange={(event) => onKeywordChange(event.target.value)}
					onSearch={(value) => onKeywordChange(value)}
				/>
			</Col>
			<Col xs={24} sm={12} md={6}>
				<Select
					allowClear
					placeholder='Lọc theo thẻ'
					value={tagId}
					style={{ width: '100%' }}
					onChange={(value) => onTagChange(value)}
					options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
				/>
			</Col>
			<Col xs={24} sm={12} md={5}>
				<Select
					placeholder='Trạng thái'
					value={status ?? 'all'}
					style={{ width: '100%' }}
					onChange={(value) => onStatusChange(value)}
					options={[
						{ label: 'Tất cả', value: 'all' },
						{ label: 'Nháp', value: 'draft' },
						{ label: 'Đã đăng', value: 'published' },
					]}
				/>
			</Col>
			<Col xs={24} md={3}>
				<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
					<Button onClick={onReset}>Đặt lại</Button>
				</Space>
			</Col>
		</Row>
	);
};

export default PostFilters;
