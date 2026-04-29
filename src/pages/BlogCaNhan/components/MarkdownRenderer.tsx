import React from 'react';

type MarkdownRendererProps = {
	content: string;
};

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const renderInline = (value: string) => {
	let text = escapeHtml(value);
	text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
	text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
	text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	return text;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
	const lines = content.split('\n');
	const nodes: React.ReactNode[] = [];
	let buffer: string[] = [];
	let listItems: string[] = [];
	let inCodeBlock = false;
	let codeBlock: string[] = [];

	const flushParagraph = () => {
		if (buffer.length === 0) return;
		nodes.push(<p key={`p-${nodes.length}`} dangerouslySetInnerHTML={{ __html: renderInline(buffer.join(' ')) }} />);
		buffer = [];
	};

	const flushList = () => {
		if (listItems.length === 0) return;
		nodes.push(
			<ul key={`ul-${nodes.length}`}>
				{listItems.map((item, index) => (
					<li key={index} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
				))}
			</ul>,
		);
		listItems = [];
	};

	const flushCode = () => {
		if (codeBlock.length === 0) return;
		nodes.push(
			<pre
				key={`code-${nodes.length}`}
				style={{ background: '#f6f8fa', padding: 16, borderRadius: 8, overflowX: 'auto' }}
			>
				<code>{codeBlock.join('\n')}</code>
			</pre>,
		);
		codeBlock = [];
	};

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith('```')) {
			if (inCodeBlock) {
				flushCode();
				inCodeBlock = false;
			} else {
				flushParagraph();
				flushList();
				inCodeBlock = true;
			}
			continue;
		}

		if (inCodeBlock) {
			codeBlock.push(line);
			continue;
		}

		if (!trimmed) {
			flushParagraph();
			flushList();
			continue;
		}

		if (trimmed.startsWith('# ')) {
			flushParagraph();
			flushList();
			nodes.push(
				<h1 key={`h1-${nodes.length}`} dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(2)) }} />,
			);
			continue;
		}

		if (trimmed.startsWith('## ')) {
			flushParagraph();
			flushList();
			nodes.push(
				<h2 key={`h2-${nodes.length}`} dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(3)) }} />,
			);
			continue;
		}

		if (trimmed.startsWith('- ')) {
			flushParagraph();
			listItems.push(trimmed.slice(2));
			continue;
		}

		if (trimmed.startsWith('> ')) {
			flushParagraph();
			flushList();
			nodes.push(
				<blockquote
					key={`quote-${nodes.length}`}
					style={{ borderLeft: '4px solid #d9d9d9', margin: '16px 0', paddingLeft: 16, color: '#595959' }}
					dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(2)) }}
				/>,
			);
			continue;
		}

		buffer.push(trimmed);
	}

	flushParagraph();
	flushList();
	flushCode();

	return <div>{nodes}</div>;
};

export default MarkdownRenderer;
