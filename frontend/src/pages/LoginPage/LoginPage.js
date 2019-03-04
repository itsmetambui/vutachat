import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import cx from 'classnames';

import client from '../../feathers';
import Spinner from '../../components/Spinner/Spinner';

import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({email, password}) => {
    setIsLoading(true);
    try {
      await client.authenticate({strategy: 'local', email, password});
    } catch(loginErr) {
      try {
        await client.service('users').create({ email, password });
        await client.authenticate({strategy: 'local', email, password});
      } catch(signupErr) {
        setError(signupErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const spinner = <div className={styles.Container}><Spinner /></div>;
  if(isLoading) return spinner;

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
