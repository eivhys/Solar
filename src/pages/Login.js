import React, { Component } from 'react'
import { StyledFirebaseAuth } from 'react-firebaseui'
import firebase from 'firebase'

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
};

class Login extends Component {

    render() {
        return (
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        );
    }
}

export default Login