// TODO: investigate why selectedUser not updated correct with hooks
import React, { useState, useEffect } from 'react';
import {unstable_createResource as createResource} from '../../vendors/react-cache'

import client from '../../feathers';
import fetchUserAndMessage from '../../services/AdminChatResource';
import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';
import UserSelect from '../../components/UserSelect/UserSelect';
import Spinner from '../../components/Spinner/Spinner';

import styles from './AdminChatPage.module.scss'
import fetchMessage from '../../services/MessageResource';

const AdminChatResource = createResource(fetchUserAndMessage);
const messageService = client.service('messages');
const userService = client.service('users');

const AdminChatPage = ({currentUser}) => {
  const { loadedUsers, loadedMessages } = AdminChatResource.read();
  const [users, setUsers] = useState(loadedUsers);
  const [messages, setMessages] = useState(loadedMessages);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [loading, setLoading] = useState(false);

  useEffect(function addUserCreatedListener() {
    const onUserCreated = user => setUsers(users => [...users, user]);
    userService.on('created', onUserCreated);
    return function removeListener() {
      userService.removeListener('created', onUserCreated);
    };
  }, []);

  useEffect(function addMessageCreatedListener() {
    const onMessageCreated = message => setMessages(messages => {
      if(message.roomId === selectedUser.rooms[0]) {
        return [...messages, message];
      } else {
        return messages;
      } 
    });
    messageService.on('created', onMessageCreated);
    return function removeListener() {
      messageService.removeListener('created', onMessageCreated);
    };
  }, []);

  const sendMessage = async message => {
    return messageService.create({ text: message, roomId: selectedUser.rooms[0] });
  };

  const logout = () => {
    client.logout();
  }

  const handleUserSelected = async user => {
    setLoading(true);
    setSelectedUser(user);
    const messages = await fetchMessage(user.rooms[0]);
    setMessages(messages);
    setLoading(false);
  }

  return (
    <div className={styles.AdminChatPage}>
      <div className={styles.Header}>
        <h1 className="header-primary">Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
        <button className={styles.Button} onClick={logout}><span role="img" aria-label="emoji-popcorn">👋</span></button>
      </div>

      <aside className={styles.Sidebar}>
        <UserSelect users={users} onChange={handleUserSelected} />
      </aside>

      <div className={styles.ChatBox}>
        {loading ? <Spinner /> : <ChatBox messages={messages} currentUser={currentUser}/>}
      </div>
      
      <div className={styles.ChatForm}>
        <ChatForm onSubmit={sendMessage} />
      </div>
    </div>
    
  );
};

export default AdminChatPage;


