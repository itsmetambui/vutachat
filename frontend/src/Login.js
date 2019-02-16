import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import client from './feathers';

const Login = () => {
  const [error, setError] = useState(null);

  const login = async ({email, password}) => {
    try {
      await client.authenticate({strategy: 'local', email, password});
    } catch(loginErr) {
      try {
        await client.service('users').create({ email, password });
        await client.authenticate({strategy: 'local', email, password});
      } catch(signupErr) {
        setError(signupErr);
      }
    }
  };

  return (
    <div className="login">
      <h1 className="header-primary">Welcome to vutachat <span role="img" aria-label="emoji-100">💯</span></h1>
      <Formik
        initialValues={{ email: '', password: '123456' }} // For fast login
        onSubmit={(values, { setSubmitting }) => {
          login(values);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Are you sure this is a valid email? 🤔')
            .required('I will not spam your inbox! 😁'),
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                id="email"
                placeholder="Could I have your email address please?"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.email && touched.email ? 'login-form__input--error' : 'login-form__input'
                }
              />
              {errors.email &&
                touched.email && <div className="input-feedback">{errors.email}</div>}

              <button className="login-form__btn" type="submit" disabled={isSubmitting}>
                <span role="img" aria-label="emoji-submit">👉</span>
              </button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;
