import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import client from './feathers';

const messageService = client.service('messages');
const userService = client.service('users');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxEl = useRef(null);

  useEffect(function fetchData() {
    Promise.all([
      messageService.find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      }),
      userService.find()
    ]).then( ([ messagePage, userPage ]) => {
      setMessages(messagePage.data.reverse());
      setUsers(userPage.data);
    });
  }, []);

  useEffect(function addMessageCreatedListener() {
    const onMessageCreated = message => setMessages(messages => [...messages, message]);
    messageService.on('created', onMessageCreated);
    return function removeListener() {
      messageService.removeListener('created', onMessageCreated);
    };
  }, []);

  useEffect(function addUserCreatedListener() {
    const onUserCreated = user => setUsers(users => [...users, user]);
    userService.on('created', onUserCreated);
    return function removeListener() {
      userService.removeListener('created', onUserCreated);
    };
  }, []);

  useEffect(function scrollToBottomEffect() {
    const scrollToBottom = el => el.scrollTop = el.scrollHeight - el.clientHeight;
    const handler = () => scrollToBottom(chatBoxEl.current);
    handler();
    messageService.on('created', handler);
    return function removeListener () { 
      messageService.removeListener('created', handler); 
    };
  }, []);

  const sendMessage = e => {
    e.preventDefault();
    if(newMessage) {
      messageService.create({ text: newMessage }).then(() => {
        setNewMessage('');
      });
    }
  };

  return (
    <main className="flex flex-column">
      <header className="title-bar flex flex-row flex-center">
        <div className="title-wrapper block center-element">
          <img className="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
            alt="Feathers Logo" />
          <span className="title">Chat</span>
        </div>
      </header>

      <div className="flex flex-row flex-1 clear">
        <aside className="sidebar col col-3 flex flex-column flex-space-between">
          <header className="flex flex-row flex-center">
            <h4 className="font-300 text-center">
              <span className="font-600 online-count">{users.length}</span> users
            </h4>
          </header>

          <ul className="flex flex-column flex-1 list-unstyled user-list">
            {users.map(user => <li key={user._id}>
              <a className="block relative" href="#">
                <img src={user.avatar} alt={user.email} className="avatar" />
                <span className="absolute username">{user.email}</span>
              </a>
            </li>)}
          </ul>
          <footer className="flex flex-row flex-center">
            <a href="#" onClick={() => client.logout()} className="button button-primary">
              Sign Out
            </a>
          </footer>
        </aside>

        <div className="flex flex-column col col-9">
          <main className="chat flex flex-column flex-1 clear" ref={chatBoxEl}>
            {messages.map(message => <div key={message._id} className="message flex flex-row">
              <img src={message.user.avatar} alt={message.user.email} className="avatar" />
              <div className="message-wrapper">
                <p className="message-header">
                  <span className="username font-600">{message.user.email}</span>
                  <span className="sent-date font-300">{moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
                </p>
                <p className="message-content font-300">{message.text}</p>
              </div>
            </div>)}
          </main>

          <form onSubmit={sendMessage} className="flex flex-row flex-space-between" id="send-message">
            <input type="text" name="text" className="flex flex-1" onChange={e => setNewMessage(e.target.value)} value={newMessage} />
            <button className="button-primary" type="submit">Send</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chat;
