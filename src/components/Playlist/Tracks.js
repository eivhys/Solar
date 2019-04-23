import React from 'react'
import { Icon } from 'antd'
import { Menu, Text } from 'grommet'
import { newTrack, queueTrack, setPlaylist, } from '../../store/actions/musicActions';
import { connect } from 'react-redux'
import firebase from 'firebase'
import { findWithAttr } from '../../store/reducers/musicReducer';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'

function Tracks({ playlist, stars = true, options = true, music, dispatch }) {

    const addFavourite = (track, playlist) => {
        const playlistRef = firebase.firestore().collection('playlists').doc(playlist.id)
        const key = findWithAttr(playlist.tracks, "ytId", track.ytId)
        const updatedTrack = {
            ...playlist.tracks[key],
            favourite: !playlist.tracks[key].favourite
        }
        console.log(updatedTrack.favourite)
        const updatedTracks = []
        playlist.tracks.forEach((t, i) => {
            if (i === key) {
                updatedTracks.push(updatedTrack)
            } else {
                updatedTracks.push(t)
            }
        })

        playlistRef.set({
            ...playlist,
            tracks: [...updatedTracks]
        })

    }

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
                                {stars && <Icon type="star" style={{ paddingTop: 25, paddingLeft: 10, paddingRight: 15 }} theme={tracks[key].favourite ? "filled" : "outlined"} onClick={() => addFavourite(tracks[key], playlist)} />}
                                <h3>{tracks[key].title}</h3>
                            </div>
                            <div style={{ float: "right", marginTop: 12, marginRight: 24 }}>
                                <Menu
                                    label="More"
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
                                                dispatch(setPlaylist(updatedPlaylist))
                                            }
                                        },
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
)(Tracks)