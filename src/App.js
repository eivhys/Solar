import React, { Component } from 'react'
import './App.css'
import Layout from './components/Layout'
import { Router, Switch, Route } from 'react-router-dom'
import history from "./components/helpers/history"
import firebase from 'firebase'
import Playlist from './pages/Playlist'
import { Box, Heading, Button } from 'grommet'
//  import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import Favourites from './pages/Favourites'
import Home from './pages/Home'
import { Google } from 'grommet-icons';

class App extends Component {

  // The component's Local state.
  state = {
    isSignedIn: false // Local signed-in state.
  }

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
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
    )
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver()
  }

  callGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(function (error) {
      console.log(error)
    });
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
              border={{ color: 'accent-1', size: 'none' }}
              pad="medium"
              style={{ width: '300px', marginTop: '30vh' }}
              alignContent="center"
            >
              <Heading>Sign In</Heading>
              <Button icon={<Google />} label="Sign in with Google" onClick={() => this.callGoogleSignIn()} />
              {
                // Standard firebase login button
                //<StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
              }
            </Box>
          </Box>
        </div>
      )
    }
    return (
      <div className="App">
        <Router history={history}>
          <Layout>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route exact={true} path="/home" component={Home} />
              <Route exact={true} path="/favourites" component={Favourites} />
              <Route exact={true} path="/playlists/:id" component={Playlist} />
            </Switch>
          </Layout>
        </Router>
      </div>
    )
  }
}

export default App
