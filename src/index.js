import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Document from './documents/Document.js';
import Explore from './explore/explore.js';
import MyDocuments from './documents/MyDocuments';
import './styles/base.scss';
import { auth, googleProvider } from './firebase.js';

import logo from './assets/logo.png';

const WELCOME_DOC_ID = "oT2Cjcdg6GgdLaooRLqc";

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
          <Link to="/">
            <img className="logo" src={logo}/>
          </Link>
          <Link className="navbar-link" to="/documents">My Docs</Link>
          <Link className="navbar-link" to="/explore">Explore</Link>
          {authButton}
        </nav>

        <Switch>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/document/:id" component={Document} />
          <Route path="/documents">
            <MyDocuments />
          </Route>
          <Route path="/">
            <Document id={WELCOME_DOC_ID}/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
