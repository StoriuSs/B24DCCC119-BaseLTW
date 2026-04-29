import { Card, PageHeader, Typography } from 'antd';
import React from 'react';

type BlogCaNhanLayoutProps = {
	children?: React.ReactNode;
};

const BlogCaNhanLayout: React.FC<BlogCaNhanLayoutProps> = ({ children }) => {
	return (
		<div style={{ padding: 24 }}>
			<PageHeader
				ghost={false}
				title='Blog cá nhân'
				subTitle='Nơi lưu bài viết, ghi chú và trải nghiệm học tập'
				style={{ marginBottom: 16 }}
			/>
			<div>{children ?? null}</div>
		</div>
	);
};

export default BlogCaNhanLayout;
