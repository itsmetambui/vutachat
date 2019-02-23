import React, { Component } from 'react'

import client from '../../feathers';
import fetchUserAndMessage from '../../services/AdminChatResource';
import { fetchMessages } from '../../services/MessageResource';

import ChatBox from '../../components/ChatBox/ChatBox';
import ChatForm from '../../components/ChatForm/ChatForm';
import UserSelect from '../../components/UserSelect/UserSelect';
import Spinner from '../../components/Spinner/Spinner';

import styles from './AdminChatPage.module.scss';

const messageService = client.service('messages');
const userService = client.service('users');

export default class Admin extends Component {
  state = {
    users: [],
    messages: [],
    selectedUser: null,
    firstLoad: true,
    loading: false,
  }

  componentDidMount() {
    this.fetchUsersAndMessages();
    userService.on('created', this.handleUserCreated);
    messageService.on('created', this.handleMessageCreated);
  }

  componentWillUnmount() {
    userService.removeListener('created', this.handleUserCreated);
    messageService.removeListener('created', this.handleMessageCreated);
  }

  fetchUsersAndMessages = async () => {
    const { loadedUsers, loadedMessages } = await fetchUserAndMessage();
    this.setState({users: loadedUsers, messages: loadedMessages, selectedUser: loadedUsers[0], firstLoad: false});
  }

  handleUserCreated = async user => {
    this.setState(prevState => ({
      users: [...prevState.users, user]
    }))
  }

  handleMessageCreated = message => {
    if(message.roomId === this.state.selectedUser.rooms[0]) {
      this.setState(prevState => ({
        messages: [...prevState.messages, message]
      }))
    }
  }

  logout = () => {
    client.logout();
  }

  handleUserSelected = async user => {
    this.setState({loading: true, selectedUser: user});
    const messages = await fetchMessages(user.rooms[0]);
    this.setState({loading: false, messages: messages});
  }

  sendMessage = message => {
    return messageService.create({ text: message, roomId: this.state.selectedUser.rooms[0] });
  }

  render() {
    const { users, messages, firstLoad, loading } = this.state;
    const { currentUser } = this.props;

    if(firstLoad) return <div className={styles.Container}><Spinner /></div>;

    return (
      <div className={styles.AdminChatPage}>
        <div className={styles.Header}>
          <h1 className="header-primary">Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
          <button className={styles.Button} onClick={this.logout}><span role="img" aria-label="emoji-popcorn">👋</span></button>
        </div>

        <aside className={styles.Sidebar}>
          <UserSelect users={users} onChange={this.handleUserSelected} />
        </aside>

        <div className={styles.ChatBox}>
          {loading ? <Spinner /> : <ChatBox messages={messages} currentUser={currentUser}/>}
        </div>
        
        <div className={styles.ChatForm}>
          <ChatForm onSubmit={this.sendMessage} />
        </div>
      </div>
    )
  }
}
