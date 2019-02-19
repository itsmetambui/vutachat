import React, { useState, useEffect } from 'react';

import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';
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
    return <ChatPage />;
  }
  return <LoginPage />;
};

export default Application;
