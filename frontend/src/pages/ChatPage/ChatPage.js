import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar'

import client from '../../feathers';

import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';

import styles from './ChatPage.module.scss'

const messageService = client.service('messages');

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

  async function fetchData() {
    const messagePage = await messageService.find({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    });
    setMessages(messagePage.data.reverse());
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(function addMessageCreatedListener() {
    const onMessageCreated = message => setMessages(messages => [...messages, message]);
    messageService.on('created', onMessageCreated);
    return function removeListener() {
      messageService.removeListener('created', onMessageCreated);
    };
  }, []);

  const sendMessage = async message => {
    return messageService.create({ text: message });
  };

  return (
    <main className={styles.ChatPage}>
      <h1 className={cx('header-primary', styles.Header)}>Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
      <PerfectScrollbar>
        <ChatBox className={styles.ChatBox} messages={messages} />
      </PerfectScrollbar>
      <div className={styles.ChatForm}>
        <ChatForm className={styles.ChatForm} onSubmit={sendMessage} />
      </div>
    </main>
  );
};

export default ChatPage;


