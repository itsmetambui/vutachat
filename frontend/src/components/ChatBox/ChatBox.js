import React, { useEffect, useRef } from 'react';

import client from '../../feathers';
import ChatMessage from '../../components/Message/Message';

import styles from './ChatBox.module.scss';
const messageService = client.service('messages');

const ChatBox = ({messages}) => {
  const chatBoxEl = useRef(null);

  useEffect(function scrollToBottomEffect() {
    const scrollToBottom = el => el.scrollTop = el.scrollHeight - el.clientHeight;
    const handler = () => scrollToBottom(chatBoxEl.current);
    handler();
    messageService.on('created', handler);
    return function removeListener () { 
      messageService.removeListener('created', handler); 
    };
  }, []);

  return (
    <main className={styles.ChatBox} ref={chatBoxEl}>
      {messages.map(message => {
        return (
          <div key={message._id} >
            <ChatMessage
              avatar={message.user.avatar} 
              email={message.user.email} 
              createdAt={message.createdAt} 
              text={message.text}
            />
          </div>
        )
      })}
    </main>
  );
};

export default ChatBox;