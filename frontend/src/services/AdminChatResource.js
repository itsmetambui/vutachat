import fetchUser from './UserResource';
import fetchMessage from './MessageResource';

const fetchUserAndMessage = async () => {
  const users =  await fetchUser();
  const messages = await fetchMessage(users[0].rooms[0]);
  return { loadedUsers: users, loadedMessages: messages };
}

export default fetchUserAndMessage;
