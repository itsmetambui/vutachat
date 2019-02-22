import React, { useState } from 'react';
import cx from 'classnames';

import Avatar from '../Avatar/Avatar';

import styles from './UserSelect.module.scss';

const UserSelect = ({users, onChange}) => {
  const [currentUser, setCurrentUser] = useState(users[0]);

  const handleClicked = (user) => {
    if(currentUser === user) return;
    setCurrentUser(user);
    onChange(user);
  };

  return (
    <ul className={styles.UserSelect}>
      {users.map(user => <li key={user._id} className={cx(
        [styles.User],
        { [styles.Active]: user === currentUser }
      )}>
        <button className={styles.Button} onClick={() => handleClicked(user)}>
          <Avatar src={user.avatar} />
          <span className={styles.Username}>{user.email}</span>
        </button>
      </li>)}
    </ul>
  );
};

export default UserSelect;