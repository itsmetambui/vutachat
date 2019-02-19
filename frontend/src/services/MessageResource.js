import client from '../feathers';
const messageService = client.service('messages');

const fetchMessage = async roomId => {
  const result =  await messageService.find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25,
      roomId
    }
  });
  return result.data.reverse();
}

export default fetchMessage;
