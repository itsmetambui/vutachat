import { useState, useEffect } from 'react';

import client from '../feathers';

const messageService = client.service('messages');

const useMessages = (initMessages = [], initialRoomId) => {
  const [ messages, setMessages ] = useState(initMessages);
  const [ roomId ] = useState(initialRoomId); // TODO: this state not updated with latest state.

  const handleMessageCreated = message => setMessages(messages => {
    if(!roomId || message.roomId === roomId) return [...messages, message];
    return messages;
  });

  useEffect(function addMessageCreatedListener() {
    messageService.on('created', handleMessageCreated);

    return function removeListener() {
      messageService.removeListener('created', handleMessageCreated);
    };
  }, []);

  return [messages, setMessages];
}

export default useMessages;