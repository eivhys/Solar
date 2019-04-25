import React from 'react'
import { Menu, Text } from 'grommet'
import { newTrack, queueTrack, } from '../../store/actions/musicActions';
import { connect } from 'react-redux'
import firebase from 'firebase'
import { findWithAttr } from '../../store/reducers/musicReducer';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'

function FavouriteTracks({ playlist, stars = true, options = true, music, dispatch }) {

    const tracks = playlist.tracks

    if (tracks === undefined || tracks.length === 0) {
        return <Text style={{ marginLeft: 24, display: '-webkit-box' }}><br />No tracks in playlist...</Text >
    }

    return (
        <div className="trackList" >
            {
                Object.keys(tracks).map(
                    (key, id) => (
                        <div className="track" key={tracks[key].ytId} style={{ backgroundColor: playlist.id === music.playlist.id && music.currentTrack.ytId === tracks[key].ytId ? "#555555" : "" }} onDoubleClick={() => {
                            dispatch(newTrack(findWithAttr(tracks, "ytId", tracks[key].ytId), tracks[key], playlist))
                        }
                        } >
                            <div style={{ float: "left", display: "flex" }}>
                                <h3 style={{ marginLeft: 25 }}>{tracks[key].title}</h3>
                            </div>
                            <div style={{ float: "right", marginTop: 12, marginRight: 24 }}>
                                <Menu
                                    label="More"
                                    dropAlign={{ top: 'bottom', right: 'right' }}
                                    items={[
                                        { label: 'Queue', onClick: () => dispatch(queueTrack(tracks[key])) },
                                        { label: 'Share track', onClick: () => { }, disabled: true },
                                        { label: 'Download', onClick: () => { }, disabled: true },
                                    ]}
                                />
                            </div>
                        </div>
                    )
                )
            }
        </div>
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