import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import EditDocument from './documents/EditDocument.js';
import ViewDocument from './documents/ViewDocument';
import Explore from './explore/explore.js';
import Welcome from './welcome/Welcome.js';
import MyDocuments from './documents/MyDocuments';
import {SignIn} from './firebase.js';
import './styles/base.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <nav>
          {/*
            Eventually, we'll want the home page to direct to My Documents for
            logged in users, and Welcome otherwise. For now, they are separate
            links.
          */}
          <Link className="logo" to="/welcome">
            🧊🖊️
          </Link>
          <Link className="navbar-link" to="/">My Docs</Link>
          <Link className="navbar-link" to="/explore">Explore</Link>
          <Link className="navbar-link" to="/document/1">Edit Document 1</Link>
          <Link className="navbar-link" to="/view/1">View Document 1</Link>
          <SignIn/>
          {/* <Link className="button" onClick={signInWithGoogle} to="/">Login</Link> */}
        </nav>


        <Switch>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/welcome">
            <Welcome />
          </Route>
          <Route path="/document/:id">
            <EditDocument />
          </Route>
          <Route path="/view/:id">
            <ViewDocument />
          </Route>
          <Route path="/">
            <MyDocuments />
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
