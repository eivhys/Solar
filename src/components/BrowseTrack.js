import React, { Component } from 'react'
import { Box, Image, Text, Menu } from 'grommet';
import { Add, Update } from 'grommet-icons';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import firebase from 'firebase'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { addTrack } from '../components/helpers/firebaseActions';

class BrowseTrack extends Component {
    render() {
        return (
            <Box height="small" width="medium" margin="medium">
                <Image fit="cover" src="//v2.grommet.io/assets/Wilderpeople_Ricky.jpg" />
                <Box direction="row" fill="horizontal" alignContent="stretch" background="dark-2">
                    <Text margin="small" >Title</Text>
                    <Box fill="horizontal" />
                    <Menu icon={<Add />}
                        dropAlign={{ right: 'right', bottom: 'bottom' }}
                        items={
                            !isLoaded(this.props.playlists) ? [{ icon: <Update className="spin" />, label: 'Loading...', disabled: true }] :
                                isEmpty(this.props.playlists) ? [{ label: 'No playlists', disabled: true }] :
                                    this.props.playlists.map(playlist => {
                                        return {
                                            label: playlist.name,
                                            onClick: () => { addTrack('https://www.youtube.com/watch?v=Eelfbl1ZLrE', playlist) }
                                        }
                                    })}
                    />
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
    connect((state, props) => ({
        playlists: state.firestore.ordered.playlists,
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(BrowseTrack)