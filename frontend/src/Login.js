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
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Log in or signup</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
            <fieldset>
              <input className="block" type="email" name="email" placeholder="email" onChange={e => setEmail(e.target.value)} value={email} />
            </fieldset>

            <fieldset>
              <input className="block" type="password" name="password" placeholder="password" onChange={e => setPassword(e.target.value)} value={password} />
            </fieldset>

            <button type="button" className="button button-primary block signup" onClick={login}>
              Log in
            </button>

            <button type="button" className="button button-primary block signup" onClick={signup}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
