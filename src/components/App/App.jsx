import { useAuth, useResolved } from 'hooks';
import 'semantic-ui-css/semantic.min.css';
import { Login, Register, Chat } from 'components';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { ChatProvider } from 'context/ChatContext';

export const App = () => {

const history = useHistory();
const { authUser } = useAuth();
const authResolved = useResolved(authUser);

// redirect to login if not logged in
// if logged in redirect > chat
useEffect(() => {
  if (authResolved) {
    history.push(!!authUser ? '/' : '/login');
  }
},[authUser, authResolved, history]);

  // routes are children of chat provider
  return (
    authResolved ? <ChatProvider authUser={authUser}>
      <div className="app">
      <Switch>
        <Route exact path="/" component={Chat} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </div>
    </ChatProvider> : <>Loading...</>
  );
};
