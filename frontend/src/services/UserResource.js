import client from '../feathers';
const userService = client.service('users');

const fetchUser = async () => {
  const result =  await userService.find();
  const jwt = await client.passport.getJWT();
  const currentUser = await client.passport.verifyJWT(jwt);
  return result.data.filter(user => user._id !== currentUser.userId);
}

export default fetchUser;
