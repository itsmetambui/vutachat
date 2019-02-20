import React, { useState, useEffect } from 'react';
import {unstable_createResource as createResource} from 'react-cache'

import client from '../../feathers';
import fetchUserAndMessage from '../../services/AdminChatResource';
import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';

import styles from './AdminChatPage.module.scss'

const AdminChatResource = createResource(fetchUserAndMessage);
const messageService = client.service('messages');
const userService = client.service('users');

const AdminChatPage = () => {
  const { loadedUsers, loadedMessages } = AdminChatResource.read();
  const [users, setUsers] = useState(loadedUsers);
  const [messages, setMessages] = useState(loadedMessages);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(function addUserCreatedListener() {
    const onUserCreated = user => setUsers(users => [...users, user]);
    userService.on('created', onUserCreated);
    return function removeListener() {
      userService.removeListener('created', onUserCreated);
    };
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

  const logout = () => {
    client.logout();
  }

  return (
    <div className={styles.AdminChatPage}>

      <aside className={styles.Sidebar}>
        <ul className="flex flex-column flex-1 list-unstyled user-list">
          {users.map(user => <li key={user._id}>
            <button className="block relative">
              <img src={user.avatar} alt={user.email} className="avatar" />
              <span className="absolute username">{user.email}</span>
            </button>
          </li>)}
        </ul>
      </aside>

      <main className={styles.Main}>
        <div className={styles.Header}>
          <h1 className="header-primary">Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
          <button className={styles.Button} onClick={logout}><span role="img" aria-label="emoji-popcorn">👋</span></button>
        </div>
        
        <ChatBox className={styles.ChatBox} messages={messages} />
        <div className={styles.ChatForm}>
          <ChatForm className={styles.ChatForm} onSubmit={sendMessage} />
        </div>
      </main>
    </div>
    
  );
};

export default AdminChatPage;


