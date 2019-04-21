import React from 'react'
import { Icon } from 'antd'
import { Menu } from 'grommet'
import { newTrack, } from '../../store/actions/musicActions';
import { connect } from 'react-redux'
import { findWithAttr } from '../../store/reducers/musicReducer';

function Tracks({ playlist, stars = true, options = true, music, dispatch }) {

    const tracks = playlist.tracks

    if (tracks === undefined || tracks.length === 0) {
        return <p>No tracks in playlist...</p>
    }

    return (
        <div className="trackList" >
            {
                Object.keys(tracks).map(
                    (key, id) => (
                        <div className="track" key={tracks[key].ytId} style={{ backgroundColor: playlist.id === music.playlistId && music.currentTrack === id ? "#555555" : "" }} onDoubleClick={() => {
                            dispatch(newTrack(findWithAttr(tracks, "ytId", tracks[key].ytId), playlist.id, playlist.length))
                        }
                        } >
                            <div style={{ float: "left", display: "flex" }}>
                                {stars && <Icon type="star" style={{ marginTop: 24, marginLeft: 10 }} theme={tracks[key].starred ? "filled" : "outlined"} />}
                                <h3 style={{ marginLeft: 15 }}>{tracks[key].title}</h3>
                            </div>
                            <div style={{ float: "right", marginTop: 12, marginRight: 24 }}>
                                <Menu
                                    label="More"
                                    dropAlign={{ top: 'bottom', right: 'right' }}
                                    items={[
                                        { label: 'Share track', onClick: () => { } },
                                        { label: 'Download', onClick: () => { } },
                                        { label: 'Remove from playlist', onClick: () => { } },
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