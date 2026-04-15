import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import styles from './index.less';

const ProfileCardDemo: React.FC = () => {
	const profile = {
		name: 'Nguyễn Văn A',
		description:
			'Lập trình viên React với 5 năm kinh nghiệm. Tập trung xây dựng giao diện mượt, dễ dùng và tối ưu trải nghiệm trên mọi kích thước màn hình.',
		image:
			'https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740&q=80',
	};

	return (
		<div className={styles.demoContainer}>
			<div className={styles.pageTitleWrap}>
				<h1>Profile Card</h1>
				<p>Một thẻ hồ sơ responsive, hiển thị đẹp trên desktop và mobile.</p>
			</div>

			<div className={styles.cardWrapper}>
				<ProfileCard name={profile.name} description={profile.description} image={profile.image} />
			</div>
		</div>
	);
};

export default ProfileCardDemo;
