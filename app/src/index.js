import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import EditDocument from './documents/EditDocument.js';
import ViewDocument from './documents/ViewDocument';
import Explore from './explore/explore.js';
import Welcome from './welcome/Welcome.js';
import MyDocuments from './documents/MyDocuments';
import './styles/base.scss';
import { auth, googleProvider } from './firebase.js';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  login() {
    auth.signInWithPopup(googleProvider).then((result) => {
      this.setState({
        user: result.user
      })
    })  
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      })
    })
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user})
      }
    })
  }

  render() {
    let authButton = this.state.user ? <Link className="button" onClick = {this.logout} to="/">Log Out</Link> : <Link className="button" onClick={this.login} to="/">Log In</Link>
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
          {authButton}
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
