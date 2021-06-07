import { FormField } from 'components';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { defaultValues, validationSchema } from './formikConfig';
import { fb } from 'service';

// registration form using formik objects
// submit button is disabled if the form is not valid or the form is submitting
export const Register = () => {
  const history = useHistory();
  const [serverError, setServerError] = useState('');

  // create user in FB auth > chatengine > firestore
  // call api function to create user
  const reg = ({ email, userName, password }, { setSubmitting }) => {
    fb.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res?.user?.uid) {
          fetch('/api/createUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName,
              userId: res.user.uid,
            }),
          }).then(() => {
            fb.firestore
              .collection('users')
              .doc(res.user.uid)
              .set({ userName, avatar: '' });
          });
        } else {
          setServerError(
            'We encoutered an issue trying to register you. Please try again',
          );
        }
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          setServerError('An account with this email already exists');
        } else {
          setServerError(
            'We encoutered an issue trying to register you. Please try again',
          );
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="auth-form">
      <h1>Register</h1>

      <Formik
        onSubmit={reg}
        validateOnMount={true}
        initialValues={{ defaultValues }}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <FormField name="userName" label="Username" />
            <FormField name="email" label="Email" type="email" />
            <FormField name="password" label="Password" type="password" />
            <FormField
              name="verifyPassword"
              label="Verify Password"
              type="password"
            />

            <div className="auth-link-container">
              Already Registered?{' '}
              <span className="auth-link" onClick={() => history.push('login')}>
                Log In!
              </span>
            </div>

            <button disabled={isSubmitting || !isValid} type="submit">
              Register
            </button>
          </Form>
        )}
      </Formik>
      {!!serverError && <div className="error">{serverError}</div>}
    </div>
  );
};

// google app # project-638022400419
