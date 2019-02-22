import React, { useState, useEffect, Suspense } from 'react';

import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';
import AdminChatPage from './pages/AdminChatPage/AdminChatPage';
import Admin from './pages/AdminChatPage/Admin';
import Spinner from './components/Spinner/Spinner';
import client from './feathers';

import styles from './App.module.scss';

const Application = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const authenticate = async () => {
    try {
      await client.authenticate();
      const jwt = await client.passport.getJWT();
      const currentUser = await client.passport.verifyJWT(jwt);
      setCurrentUser(currentUser);
      setIsAuthenticated(true);
    } catch(e) {
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    authenticate();
  }, []);

  useEffect(function addAuthenticatedListener() {
    const onAuthenticated = async jwt => {
      setIsAuthenticated(true);
      const payload = await client.passport.verifyJWT(jwt.accessToken);
      setCurrentUser(payload);
      setIsAdmin(payload.isAdmin);
    }
    client.on('authenticated', onAuthenticated);
    return function removeListener() {
      client.removeListener('authenticated', onAuthenticated);
    };
  }, []);

  useEffect(function addLogoutListener() {
    const onLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
    client.on('logout', onLogout);
    return function removeListener() {
      client.removeListener('logout', onLogout);
    };
  }, []);

  const spinner = <div className={styles.Container}><Spinner /></div>;
  if(isAuthenticated == null) return spinner;
  if(!isAuthenticated) return <LoginPage />;
  if(isAdmin == null) return spinner;
  // if(isAdmin) return <Suspense fallback={<div className={styles.Container}><Spinner /></div>}><AdminChatPage currentUser={currentUser} /></Suspense>;
  if(isAdmin) return <Admin currentUser={currentUser} />;
  return <Suspense fallback={<div className={styles.Container}><Spinner /></div>}><ChatPage currentUser={currentUser} /></Suspense>;
};

export default Application;