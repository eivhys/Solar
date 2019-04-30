import React, { Component } from 'react'
import { Heading, Box } from 'grommet';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import firebase from 'firebase'
import BrowseTrack from '../components/BrowseTrack';

class Home extends Component {
    render() {
        console.log(this.props)
        return (
            <Box fill>
                <Heading>Home</Heading>
                <Box alignSelf="center" fill overflow="hidden">
                    <BrowseTrack/>
                </Box>
            </Box>
        );
    }
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
    connect((state) => ({
        playlists: state.firestore.ordered.playlists,
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(Home)