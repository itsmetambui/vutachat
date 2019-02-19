import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import cx from 'classnames';
import { Redirect } from "react-router-dom";

import client from '../../feathers';

import styles from './LoginPage.module.scss';

const LoginPage = (props) => {
  console.log('Render login');
  const [error, setError] = useState(null);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const login = async ({email, password}) => {
    try {
      await client.authenticate({strategy: 'local', email, password});
      setRedirectToReferrer(true);
    } catch(loginErr) {
      try {
        await client.service('users').create({ email, password });
        await client.authenticate({strategy: 'local', email, password});
        setRedirectToReferrer(true);
      } catch(signupErr) {
        setError(signupErr);
        setRedirectToReferrer(false);
      }
    }
  };

  if(props.isAuthenticated || redirectToReferrer) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.LoginPage}>
      <h1 className="header-primary">Welcome to vutachat <span role="img" aria-label="emoji-100">💯</span></h1>
      <Formik
        initialValues={{ email: '', password: '123456' }} // For fast login
        onSubmit={(values) => {
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
            <form className={styles.LoginForm} onSubmit={handleSubmit}>
              <input
                id="email"
                placeholder="Could I have your email address please?"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cx({
                  [styles.Input]: true,
                  [styles.InputError]: errors.email && touched.email
                })}
                autoComplete="off"
              />
              {errors.email &&
                touched.email && <div className={styles.Feedback}>{errors.email}</div>}
              {error && <div className={styles.Feedback}>{error.message}</div>}

              <button className={styles.Button} type="submit" disabled={isSubmitting}>
                <span role="img" aria-label="emoji-submit">👉</span>
              </button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginPage;
