import { useState, useEffect } from 'react';

import client from '../feathers';

const userService = client.service('users');

const useUsers = (initState = []) => {
  const [users, setUsers] = useState(initState);

  const handleUserCreated = user => setUsers(users => [...users, user]);

  useEffect(function adduserCreatedListener() {
    userService.on('created', handleUserCreated);

    return function removeListener() {
      userService.removeListener('created', handleUserCreated);
    };
  }, []);

  return users;
}

export default useUsers;