export const formatVND = (value?: number) => {
	const amount = Number(value || 0);
	return `${amount.toLocaleString('vi-VN')} đ`;
};

export const statisticVNDFormatter = (value: string | number) => {
	const amount = Number(value || 0);
	return formatVND(amount);
};
