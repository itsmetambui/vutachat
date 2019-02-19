import React from 'react';
import moment from 'moment';

import styles from './Message.module.scss';

const ChatMessage = ({avatar, email, createdAt, text, self}) => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Message}>
        <Avatar src={avatar} />
        <div className={styles.MainContent}>
          <MessageMeta email={email} createdAt={createdAt} />
          <MessageText text={text} />
        </div>
      </div>
    </div>
  );
};

const Avatar = ({src}) => {
  return (
    <img src={src} alt="avatar" className={styles.Avatar} />
  );
};

const MessageMeta = ({email, createdAt}) => {
  return (
    <p className={styles.Meta}>
      <span>{email}</span>
      <span style={{fontStyle: "italic"}}>{moment(createdAt).format('MMM Do, hh:mm:ss')}</span>
    </p>
  );
};

const MessageText = ({text}) => {
  return (
    <p className={styles.Text}>{text}</p>
  );
};

export default ChatMessage;