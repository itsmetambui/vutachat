import { useState, useEffect } from 'react';
import UIfx from 'uifx';

import client from '../feathers';
import ringtoneMp3 from '../assets/ringtone.mp3';

const messageService = client.service('messages');
const notificationSound = new UIfx(ringtoneMp3);

const useMessages = (initMessages = [], initialRoomId) => {
  const [messages, setMessages] = useState(initMessages);
  const [roomId] = useState(initialRoomId); // TODO: this state not updated with latest state.

  const handleMessageCreated = message => setMessages(messages => {
    if (!roomId || message.roomId === roomId) {
      notificationSound.play();
      return [...messages, message];
    }
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