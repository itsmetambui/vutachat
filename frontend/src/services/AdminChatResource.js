import fetchUser from './UserResource';
import { fetchMessages } from './MessageResource';

const fetchUserAndMessage = async () => {
  const users =  await fetchUser();
  const messages = await fetchMessages(users[0].rooms[0]);
  return { loadedUsers: users, loadedMessages: messages };
}

export default fetchUserAndMessage;
