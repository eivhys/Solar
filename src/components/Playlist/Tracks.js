import React from 'react'
import { Icon } from 'antd'
import { Menu, Text } from 'grommet'
import { newTrack, queueTrack, setPlaylist, } from '../../store/actions/musicActions';
import { connect } from 'react-redux'
import firebase from 'firebase'
import { findWithAttr } from '../../store/reducers/musicReducer';

function Tracks({ playlist, stars = true, options = true, music, dispatch }) {

    const tracks = playlist.tracks

    if (tracks === undefined || tracks.length === 0) {
        return <Text style={{ marginLeft: 24 }}><br />No tracks in playlist...</Text >
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
                                {stars && <Icon type="star" style={{ marginTop: 25, marginLeft: 10 }} theme={tracks[key].starred ? "filled" : "outlined"} />}
                                <h3 style={{ marginLeft: 15 }}>{tracks[key].title}</h3>
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

export default
    connect((state, props) => ({
        dispatch: state.dispatch,
        music: state.music
    }
    ))(Tracks)