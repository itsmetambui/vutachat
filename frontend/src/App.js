import React, { useState, useEffect } from 'react';

import Login from './Login';
import Chat from './Chat';
import client from './feathers';

import './App.scss';

const Application = () => {
  const [login, setLogin] = useState(null);

  useEffect(function tryAuthenticate() {
    client.authenticate().catch(() => setLogin(null));
  }, []);

  useEffect(function addAuthenticatedListener() {
    const onAuthenticated = login => setLogin(login);
    client.on('authenticated', onAuthenticated);
    return function removeListener() {
      client.removeListener('authenticated', onAuthenticated);
    };
  }, []);

  useEffect(function addLogoutListener() {
    const onLogout = () => setLogin(null);
    client.on('logout', onLogout);
    return function removeListener() {
      client.removeListener('logout', onLogout);
    };
  }, []);
  
  if(login) {
    return <Chat />;
  }
  return <Login />;
};

export default Application;