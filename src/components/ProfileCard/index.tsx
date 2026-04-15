import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './index.less';

interface ProfileCardProps {
	name: string;
	description: string;
	image: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, description, image }) => {
	const isDesktop = useMediaQuery({ minWidth: 769 });

	return (
		<div className={`${styles.profileCard} ${isDesktop ? styles.horizontal : styles.vertical}`}>
			<div className={styles.imageWrapper}>
				<img src={image} alt={name} />
			</div>
			<div className={styles.infoWrapper}>
				<h2>{name}</h2>
				<p>{description}</p>
			</div>
		</div>
	);
};

export default ProfileCard;
