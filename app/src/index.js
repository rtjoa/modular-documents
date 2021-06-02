import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Document from './documents/Document.js';
import Explore from './explore/explore.js';
import Welcome from './welcome/Welcome.js';
import MyDocuments from './documents/MyDocuments';
import './styles/base.scss';
import { auth, googleProvider } from './firebase.js';

import logo from './shared/logo.png';

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
    let authButton = this.state.user ?
      <Link className="button" onClick = {this.logout}>Log Out</Link>
      : <Link className="button" onClick={this.login}>Log In</Link>
    return (
      <Router>
        <nav>
          {/*
            Eventually, we'll want the home page to direct to My Documents for
            logged in users, and Welcome otherwise. For now, they are separate
            links.
          */}
          <Link classname="logo" to="/welcome">
            <img src={logo}/>
          </Link>
          <Link className="navbar-link" to="/">My Docs</Link>
          <Link className="navbar-link" to="/explore">Explore</Link>
          <Link className="navbar-link" to="/document/NUy1X0C3nCsPexG46dVj">Example Document</Link>
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
            <Document />
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
