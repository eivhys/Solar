import React from 'react'
import { Icon } from 'antd'
import { Menu, Text, Box } from 'grommet'
import { newTrack, queueTrack, setPlaylist, } from '../../store/actions/musicActions';
import { connect } from 'react-redux'
import firebase from 'firebase'
import { findWithAttr } from '../../store/reducers/musicReducer';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import { More } from 'grommet-icons';
import { addFavourite } from '../helpers/firebaseActions'
import { isMobile } from 'react-device-detect'

function Tracks({ playlist, stars = true, options = true, music, dispatch }) {



    const tracks = playlist.tracks

    if (tracks === undefined || tracks.length === 0) {
        return <Text style={{ display: '-webkit-box' }}><br />No tracks in playlist...</Text >
    }

    return (
        <Box className="trackList" style={{ display: 'block' }} >
            {
                Object.keys(tracks).map(
                    (key, id) => (
                        <Box className="track" key={tracks[key].ytId} style={
                            music.playlist.id === playlist.id && tracks[key].ytId === music.currentTrack.ytId ? {
                                backgroundColor: '#555',
                                borderLeft: "5px var(--accent-1) solid"
                            } : {}
                        } onDoubleClick={() => {
                            !isMobile && dispatch(newTrack(findWithAttr(tracks, "ytId", tracks[key].ytId), tracks[key], playlist))
                        }
                        }

                            onClick={() => {
                                isMobile && dispatch(newTrack(findWithAttr(tracks, "ytId", tracks[key].ytId), tracks[key], playlist))
                            }}>
                            <Box fill="horizontal" direction="row" alignContent="between" overflow="hidden" >
                                <Box fill="horizontal" direction="row">
                                    {stars &&
                                        <Icon style={{ padding: "15px 10px 0px 10px" }} type="star" theme={tracks[key].favourite ? "filled" : "outlined"} onClick={() => addFavourite(tracks[key], playlist)} />}
                                    <Text size="large" margin={{ top: '8px' }} className="truncate">{tracks[key].title}</Text>
                                </Box>
                                <Box direction="row" >
                                    {options && <Menu
                                        icon={<More />}
                                        style={{ float: 'right' }}
                                        dropAlign={{ top: 'bottom', right: 'right' }}
                                        items={[
                                            { label: 'Queue', onClick: () => dispatch(queueTrack(tracks[key])) },
                                            { label: 'Share track', onClick: () => { }, disabled: true },
                                            { label: 'Download', onClick: () => { }, disabled: true },
                                            {
                                                label: 'Remove from playlist', onClick: () => {
                                                    const updatedPlaylist = {
                                                        ...playlist,
                                                        tracks: playlist.tracks.filter(track => track.ytId !== tracks[key].ytId)
                                                    }
                                                    firebase.firestore().collection('playlists').doc(playlist.id).update(updatedPlaylist)
                                                    if (music.playlist.id === playlist.id) {
                                                        dispatch(setPlaylist(updatedPlaylist))
                                                    }
                                                }
                                            },
                                        ]}
                                    />}
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
)(Tracks)