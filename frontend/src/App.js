import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';
import Spinner from './components/Spinner/Spinner';
import client from './feathers';

import styles from './App.module.scss';

const Application = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  console.log('Render app');

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
    const onAuthenticated = login => {
      setIsAuthenticated(true);
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

  if(isAuthenticated == null) return <div className={styles.Container}><Spinner /></div>;

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={ChatPage} isAuthenticated={isAuthenticated}/>
        <Route path="/login" render={(props) => <LoginPage {...props} isAuthenticated={isAuthenticated} />}/>
        <Route component={NoMatchPage}/>
      </Switch>
    </Router>
  );
};

export default Application;

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  console.log('Render private route');
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  )
};

const NoMatchPage = () => {
  return (
    <h1 className="header-primary">The page you're looking for is not existed!!!</h1>
  )
}