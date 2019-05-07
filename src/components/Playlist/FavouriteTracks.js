import React from 'react'
import { Menu, Text, Box } from 'grommet'
import { newTrack, queueTrack, } from '../../store/actions/musicActions';
import { connect } from 'react-redux'
import firebase from 'firebase'
import { findWithAttr } from '../../store/reducers/musicReducer';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import { More } from 'grommet-icons';

function FavouriteTracks({ playlist, stars = true, options = true, music, dispatch }) {

    const tracks = playlist.tracks

    if (tracks === undefined || tracks.length === 0) {
        return <Text style={{ marginLeft: 24, display: '-webkit-box' }}><br />No tracks in playlist...</Text >
    }

    return (
        <Box className="trackList" animation={{ type: "fadeIn", duration: 250 }} >
            {
                Object.keys(tracks).map(
                    (key, id) => (
                        <Box className="track" key={tracks[key].ytId} style={
                            music.playlist.id === playlist.id && tracks[key].ytId === music.currentTrack.ytId ? {
                                backgroundColor: '#555',
                                borderLeft: "5px var(--brand) solid"
                            } : {}
                        } onDoubleClick={() => {
                            dispatch(newTrack(findWithAttr(tracks, "ytId", tracks[key].ytId), tracks[key], playlist))
                        }
                        } >
                            <Box fill="horizontal" direction="row" alignContent="between" overflow="hidden" >
                                <Box direction="row" fill="horizontal">
                                    <Text size="large" className="truncate" margin={{ top: '8px' }}>{tracks[key].title}</Text>
                                </Box>
                                <Box direction="row">
                                    <Menu
                                        icon={<More />}
                                        dropAlign={{ top: 'bottom', right: 'right' }}
                                        items={[
                                            { label: 'Queue', onClick: () => dispatch(queueTrack(tracks[key])) },
                                            { label: 'Share track', onClick: () => { }, disabled: true },
                                            { label: 'Download', onClick: () => { }, disabled: true },
                                        ]}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )
                )
            }
        </Box>
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
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(FavouriteTracks)