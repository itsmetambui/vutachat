// TODO: investigate why selectedUser not updated correct with hooks
import React, { useState } from 'react';
import { unstable_createResource as createResource } from '../../vendors/react-cache'

import client from '../../feathers';
import fetchUserAndMessage from '../../services/AdminChatResource';
import { fetchMessages, createMessage } from '../../services/MessageResource';

import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';
import UserSelect from '../../components/UserSelect/UserSelect';
import Spinner from '../../components/Spinner/Spinner';
import useMessages from '../../hooks/useMessages';
import useUsers from '../../hooks/useUsers';

import styles from './AdminChatPage.module.scss'

const AdminChatResource = createResource(fetchUserAndMessage);

const AdminChatPage = ({ currentUser }) => {
  const { loadedUsers, loadedMessages } = AdminChatResource.read();
  const users = useUsers(loadedUsers);
  const [ selectedUser, setSelectedUser ] = useState(loadedUsers[0]);
  const roomId = selectedUser.rooms[0];
  const [ messages, setMessages ] = useMessages(loadedMessages, roomId);
  const [ loading, setLoading ] = useState(false);

  const sendMessage = async message => {
    return createMessage({ text: message, roomId: selectedUser.rooms[0] });
  };

  const logout = () => {
    client.logout();
  }

  const handleUserSelected = async user => {
    setLoading(true);
    setSelectedUser(user);
    const messages = await fetchMessages(user.rooms[0]);
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


