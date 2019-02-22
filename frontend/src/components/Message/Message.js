import React from 'react';
import moment from 'moment';
import Avatar from '../Avatar/Avatar';

import styles from './Message.module.scss';

const ChatMessage = ({avatar, email, createdAt, text, self}) => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Message}>
        <Avatar src={avatar} />
        <div className={styles.MainContent}>
          <MessageText text={text} />
          <span className={styles.Time}>{moment(createdAt).format('MMM Do, hh:mm:ss')}</span>
        </div>
      </div>
    </div>
  );
};

const MessageText = ({text}) => {
  return (
    <p className={styles.Text}>{text}</p>
  );
};

export default ChatMessage;