import React, { useState } from 'react';
import client from './feathers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const login = async () => {
    try {
      await client.authenticate({strategy: 'local', email, password});
    } catch(e) {
      setError(e);
    }
  };

  const signup = async () => {
    await client.service('users').create({ email, password });
    login();
  };

  return (
    <div className="login">
      <h1 className="header-primary">Welcome to vutachat <span role="img" aria-label="emoji-100">💯</span></h1>
      <form className="login-form">
        <input type="email" className="login-form__input" name="email" placeholder="Could I have your email address?" onChange={e => setEmail(e.target.value)} value={email} />
        <button className="login-form__btn"><span role="img" aria-label="emoji-submit">👉</span></button>
      </form>
      
    </div>
  );
};

export default Login;
