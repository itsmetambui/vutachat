import client from '../feathers';
const messageService = client.service('messages');

export const fetchMessages = async (roomId, limit) => {
  const result =  await messageService.find({
    query: {
      $sort: { createdAt: -1 },
      $limit: limit,
      roomId
    }
  });
  return result.data.reverse();
}

export const createMessage = async message => {
  messageService.create(message);
}