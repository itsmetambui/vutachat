import React from 'react';

import styles from './Avatar.module.scss';

const Avatar = ({src}) => {
  return (
    <img src={src} alt="avatar" className={styles.Avatar} />
  );
};

export default Avatar;

