import React from 'react';

import { unstable_createResource as createResource } from '../../vendors/react-cache'

import client from '../../feathers';
import { fetchMessages, createMessage } from '../../services/MessageResource';
import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';
import useMessages from '../../hooks/useMessages.js';

import styles from './ChatPage.module.scss'

const MessageResource = createResource(fetchMessages);

const ChatPage = ({currentUser}) => {
  const [ messages ] = useMessages(MessageResource.read());

  const sendMessage = async text => {
    createMessage({ text });
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
