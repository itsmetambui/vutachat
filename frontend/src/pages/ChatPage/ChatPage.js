import React, { useState, useEffect } from 'react';

import {unstable_createResource as createResource} from '../../vendors/react-cache'

import client from '../../feathers';
import fetchMessage from '../../services/MessageResource';
import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';

import styles from './ChatPage.module.scss'

const MessageResource = createResource(fetchMessage);
const messageService = client.service('messages');

const ChatPage = ({currentUser}) => {
  const [messages, setMessages] = useState(MessageResource.read());

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

  const logout = () => {
    client.logout();
  }

  return (
    <main className={styles.ChatPage}>
      <div className={styles.Header}>
        <h1 className="header-primary">Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
        <button className={styles.Button} onClick={logout}><span role="img" aria-label="emoji-popcorn">👋</span></button>
      </div>
      <ChatBox className={styles.ChatBox} messages={messages} currentUser={currentUser} />
      <div className={styles.ChatForm}>
        <ChatForm className={styles.ChatForm} onSubmit={sendMessage} />
      </div>
    </main>
  );
};

export default ChatPage;
