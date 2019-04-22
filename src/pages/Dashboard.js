import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import firebase from 'firebase'
import { firestoreConnect } from 'react-redux-firebase/'

function Playlists({ playlists, dispatch }) {
    console.log(firebase.auth().currentUser.uid)
    return (
        <p>morn</p>
    )
}

export default compose(
    firestoreConnect(() => {
        if (!firebase.auth().currentUser.uid) return []
        return [
            {
                collection: 'playlists',
                where: [
                    ['userId', '==', firebase.auth().currentUser.uid]
                ]
            }
        ]
    }), // or { collection: 'todos' }
    connect((state, props) => ({
        playlists: state.firestore.ordered.playlists,
        dispatch: state.dispatch
    }))
)(Playlists)