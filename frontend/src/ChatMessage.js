import React from 'react';
import moment from 'moment';

const ChatMessage = ({avatar, email, createdAt, text, self}) => {
  return (
    <div className={self ? 'chat-message chat-message--self' : 'chat-message'}>
      <img src={avatar} alt={email} className="chat-message__avt" />
      <div className="chat-message__main">
        <p className="chat-message__info">
          <span className="chat-message__author">{email}</span>
          <span className="chat-message__time">{moment(createdAt).format('MMM Do, hh:mm:ss')}</span>
        </p>
        <p className="chat-message__text">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;