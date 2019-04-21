import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'

function Playlists({ playlists, dispatch }) {
    return (
        <p>morn</p>
    )
}

export default compose(
    firestoreConnect(() => ['playlists']), // or { collection: 'todos' }
    connect((state, props) => ({
        playlists: state.firestore.ordered.playlists,
        dispatch: state.dispatch
    }))
)(Playlists)