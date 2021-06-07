import { Formik, Form } from 'formik';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormField } from 'components';
import { defaultValues, validationSchema } from './formikConfig';
import { fb } from 'service';
import 'firebase/app';

export const Login = () => {
  const history = useHistory();
  const [serverError, setServerError] = useState('');

  // log the user in, if invalid creds display errors
  // this is sent with setSubmitting which is the form values taken from submit
  // setSubmitting uses helper functions to compelte this process
  const login = ({ email, password }, { setSubmitting }) => {
    fb.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        if (!res.user) {
          setServerError(
            'There was an issue when attempting to login. Please try again',
          );
        }
      })
      .catch(err => {
        if (err.code === 'auth/wrong-password') {
          setServerError('Invalid credentials');
        } else if (err.code === 'auth/user-not-found') {
          setServerError('No account was found for this email');
        } else {
          setServerError('Something went wrong');
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="auth-form">
      <h1>Login</h1>
      <Formik
        onSubmit={login}
        validateOnMount={true}
        initialValues={{ defaultValues }}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <FormField name="email" label="Email" type="email" />
            <FormField name="password" label="Password" type="password" />

            <div className="auth-link-container">
              Don't have an account?{' '}
              <span
                className="auth-link"
                onClick={() => history.push('register')}
              >
                Register!
              </span>
            </div>
            <button disabled={isSubmitting || !isValid} type="submit">
              Login
            </button>
          </Form>
        )}
      </Formik>
      {!!serverError && <div className="error">{serverError}</div>}
    </div>
  );
};
