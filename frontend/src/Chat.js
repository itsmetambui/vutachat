import React, { useState, useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar'

import client from './feathers';
import ChatMessage from './components/Message/Message';

const messageService = client.service('messages');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxEl = useRef(null);

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
      })
    }
  };

  return (
    <main className="chat">
      <h1 className="header-primary chat-header">Here's my story <span role="img" aria-label="emoji-popcorn">🍿</span></h1>
      <PerfectScrollbar>
        <main className="chat-box" ref={chatBoxEl}>
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
      </PerfectScrollbar>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          id="newMessage"
          placeholder="Type a message..."
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="chat-form__input"
          autoComplete="off"
        />

        <button className="chat-form__btn" type="submit">
          <span role="img" aria-label="emoji-submit">☝️</span>
        </button>
      </form>
    </main>
  );
};

export default Chat;
