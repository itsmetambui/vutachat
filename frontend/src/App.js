import React, { useState, useEffect, Suspense } from 'react';

import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';
import AdminChatPage from './pages/AdminChatPage/AdminChatPage';
import Spinner from './components/Spinner/Spinner';
import client from './feathers';

import styles from './App.module.scss';

const Application = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  const authenticate = async () => {
    try {
      await client.authenticate();
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
    }
    client.on('logout', onLogout);
    return function removeListener() {
      client.removeListener('logout', onLogout);
    };
  }, []);

  if(isAuthenticated == null || isAdmin == null) return <div className={styles.Container}><Spinner /></div>;
  if(!isAuthenticated) return <LoginPage />
  if(isAdmin) return <Suspense fallback={<div className={styles.Container}><Spinner /></div>}><AdminChatPage /></Suspense>;
  return <Suspense fallback={<div className={styles.Container}><Spinner /></div>}><ChatPage /></Suspense>;
};

export default Application;