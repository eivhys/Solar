import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Button, RangeInput, DropButton, Box, Form, FormField, Heading } from 'grommet'
import { Play, ChapterNext, ChapterPrevious, PowerReset, Network, Pause, VolumeMute, Volume, Add } from 'grommet-icons'
import { progress, togglePlay, muteVolume, changeVolume, shuffle, prevTrack, nextTrack, repeat } from '../store/actions/musicActions';
import ReactPlayer from 'react-player'
import { firestoreConnect } from 'react-redux-firebase/'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import firebase from 'firebase'
import history from './helpers/history';

class Playlist extends React.Component {

    state = { buffering: false }

    ref = player => {
        this.player = player
    }

    addPlaylist = (e) => {
        const playlist = {
            name: e.value.name,
            description: e.value.description === undefined ? "" : e.value.description,
            tracks: [],
            userId: firebase.auth().currentUser.uid
        }
        const newPlaylist = firebase.firestore().collection("playlists").doc()
        newPlaylist.set(playlist)
        history.push('/playlists/' + newPlaylist.id)
    }

    render() {
        const { music, dispatch, playlists } = this.props
        const addPlaylist = (<DropButton style={{ marinLeft: 10 }}
            icon={<Add />}
            label=""
            dropAlign={{ bottom: 'bottom', left: 'left' }}
            dropContent={
                <Box elevation="xlarge" alignSelf="center" pad="large" width="medium" background="light-1">
                    <Heading style={{ color: "#333" }}>New Playlist</Heading>
                    <Form onSubmit={this.addPlaylist}>
                        <FormField name="name" label="Name" required={true} />
                        <FormField name="description" label="Description" />
                        <Button type="submit" color="accent-1" label="Create" />
                    </Form>
                </Box>
            }
        />)
        const emptyControls = (
            <div>
                <div style={{ display: "-webkit-box" }}>
                    {addPlaylist}
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<Network />}
                        active={music.shuffle}
                        onClick={() => dispatch(shuffle())}
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<ChapterPrevious />}
                        disabled={true}
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={music.playing ? <Pause /> : <Play />}
                        disabled={true}
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<ChapterNext />}
                        disabled={true}
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<PowerReset />}
                        active={music.repeat}
                        onClick={() => dispatch(repeat())}
                    />

                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={music.muted ? <VolumeMute /> : <Volume />}
                        onClick={() => dispatch(muteVolume())}
                    />
                    <RangeInput
                        style={{ width: 100 }}
                        value={music.muted ? 0 : music.volume}
                        min={0}
                        max={100}
                        step={1}
                        onChange={event => dispatch(changeVolume(event.target.value))}
                    />
                </div>
                <RangeInput
                    style={{ width: '100%', marginTop: 11.94 }}
                    value={music.timePlayed}
                    min={0}
                    max={1}
                    step={1}
                    disabled={true}
                />
            </div>
        )

        if (!isLoaded(playlists)) {
            return emptyControls
        }
        if (isEmpty(playlists)) {
            return emptyControls
        }

        /*
        let activePlaylist = playlists.find(p => {
            return p.id === music.playlist.id
        })
        */


        let activePlaylist = music.playlist

        if (activePlaylist === undefined) {
            return emptyControls
        }

        const tracks = activePlaylist.tracks
        const currentTrack = music.trackNum
        const disabled = (tracks === undefined || tracks[currentTrack] === undefined) ? true : false
        const trackUndef = tracks === undefined || tracks[currentTrack] === undefined

        const controls = (
            <div>
                <div style={{ display: "-webkit-box" }}>
                    {addPlaylist}
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<Network />}
                        active={music.shuffle}
                        onClick={() => dispatch(shuffle())}
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<ChapterPrevious />}
                        disabled={disabled || (currentTrack === 0 && (!music.repeat && !music.shuffle))}
                        onClick={(e) => {
                            dispatch(prevTrack())
                            this.player.seekTo(0)
                        }
                        }
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={music.playing ? <Pause /> : <Play />}
                        disabled={disabled}
                        onClick={() => dispatch(togglePlay())}
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<ChapterNext />}
                        // eslint-disable-next-line
                        disabled={disabled || (currentTrack === tracks.length - 1 && (!music.repeat && !music.shuffle)) && music.queue.length === 0}
                        onClick={(e) => {
                            dispatch(nextTrack())
                            this.player.seekTo(0)
                        }
                        }
                    />
                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={<PowerReset className={this.state.buffering ? "spin" : ""} />}
                        active={music.repeat}
                        onClick={() => dispatch(repeat())}
                    />

                    <Button style={{ marginLeft: 10, marginTop: 16 }}
                        icon={music.muted ? <VolumeMute /> : <Volume />}
                        onClick={() => dispatch(muteVolume())}
                    />
                    <RangeInput
                        style={{ width: 100 }}
                        value={music.muted ? 0 : music.volume}
                        min={0}
                        max={100}
                        step={1}
                        onChange={event => dispatch(changeVolume(event.target.value))}
                    />
                    <div className="cardTitles">
                        <div className="title">
                            <div className="titleContent">
                                <h4 style={{ marginTop: 28, marginLeft: 24 }}>
                                    {trackUndef ? "" : music.currentTrack.title}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <RangeInput
                    style={{ width: '100%', marginTop: trackUndef ? 11.94 : 0 }}
                    value={music.timePlayed}
                    min={0}
                    max={trackUndef ? 1 : music.currentTrack.length}
                    step={1}
                    onChange={e => {
                        dispatch(progress(e.target.value))
                        this.player.seekTo(e.target.value)
                    }
                    }
                />
            </div>
        )

        if (tracks === undefined) {
            return controls
        } else {
            return <div>
                <ReactPlayer
                    ref={this.ref}
                    height={0}
                    width={0}
                    url={`https://www.youtube.com/watch?v=${!trackUndef ? music.currentTrack.ytId : ""}`}
                    playing={music.playing}
                    onProgress={(e) => dispatch(progress(e.playedSeconds))}
                    onEnded={() => {
                        this.player.seekTo(0)
                        dispatch(nextTrack())
                    }
                    }
                    onBuffer={() => this.setState({ buffering: true })}
                    onBufferEnd={() => this.setState({ buffering: false })}
                    volume={music.volume / 100}
                    muted={music.muted}
                />
                {controls}
            </div>
        }
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
        dispatch: state.dispatch,
        music: state.music
    }))
)(Playlist)