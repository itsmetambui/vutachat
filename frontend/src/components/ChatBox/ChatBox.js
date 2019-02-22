import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import cx from 'classnames';
import client from '../../feathers';
import ChatMessage from '../../components/Message/Message';

import styles from './ChatBox.module.scss';
const messageService = client.service('messages');

const ChatBox = ({messages}) => {
  const scrollDivRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(function scrollToBottomEffect() {
    const scrollToBottom = (scrollDivEl, contentEl) => {
      scrollDivEl.scrollTop = contentEl.scrollHeight - scrollDivEl.clientHeight;
    }
    const handler = () => {
      setTimeout(() => {
        if(scrollDivRef.current == null) return;
        scrollToBottom(scrollDivRef.current._ps.element, contentRef.current);
      }, 100); // Content element height update after handler running => delay 100s
    }
    handler();
    messageService.on('created', handler);
    return function removeListener () { 
      messageService.removeListener('created', handler); 
    };
  }, [messages]);

  return (
    <PerfectScrollbar ref={scrollDivRef} className={styles.ScrollContainer}>
      <main className={styles.ChatBox} ref={contentRef}>
        {messages.map(message => {
          return (
            <div key={message._id} className={cx({[styles.Self]: message.user.email === 'itsmetambui@gmail.com'})}>
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
    </PerfectScrollbar>
  );
};

export default ChatBox;