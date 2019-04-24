import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout';
import { Router, Switch, Route } from 'react-router-dom';
import history from "./components/helpers/history";
import firebase from 'firebase'
import Playlist from './pages/Playlist';
import Dashboard from './pages/Dashboard';
import './components/helpers/Protototypes'
import { Box, Heading } from 'grommet'
import Login from './pages/Login';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Home } from 'grommet-icons';
import Search from './Search';

class App extends Component {

  // The component's Local state.
  state = {
    isSignedIn: false // Local signed-in state.
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <Box
            background="dark-1"
            alignContent="center"
            style={{ minHeight: '100vh' }}
            >
            <Box
              alignSelf="center"
              border={{ color: 'accent-1', size: 'small' }}
              pad="medium"
              style={{ width: '300px', marginTop: '30vh' }}
              alignContent="center"
            >
              <Heading>Sign In</Heading>
              <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
            </Box>
          </Box>
        </div>
      );
    }
    return (
      <div className="App">
        <Router history={history}>
          <Layout>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route exact={true} path="/home" component={Home} />
              <Route exact={true} path="/search" component={Search} />
              <Route exact={true} path="/playlists/:id" component={Playlist} />
              <Route exact={true} path="/signin" component={Login} />
            </Switch>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
