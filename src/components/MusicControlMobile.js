import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Button, RangeInput, DropButton, Box, Form, FormField, Heading, Text, Tabs, Tab } from 'grommet'
import { Play, ChapterNext, ChapterPrevious, PowerReset, Network, Pause, Add } from 'grommet-icons'
import { progress, togglePlay, shuffle, prevTrack, nextTrack, repeat } from '../store/actions/musicActions';
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

    sToTime(duration) {
        let seconds = parseInt((duration % 60))
        let minutes = parseInt((duration / 60) % 60)

        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;
        console.log(`${minutes}:${seconds}`)
        return `${minutes}:${seconds}`;
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
        const addPlaylist = (<DropButton
            icon={<Add />}
            label=""
            dropAlign={{ bottom: 'bottom', left: 'left' }}
            dropContent={
                <Box elevation="xlarge" alignSelf="center" pad="large" width="medium" background="dark-2" border="small">
                    <Tabs>
                        <Tab title="Playlist">
                            <Heading >New Playlist</Heading>
                            <Form onSubmit={this.addPlaylist}>
                                <FormField name="name" label="Name" required={true} />
                                <FormField name="description" label="Description" placeholder="Optional" />
                                <Button type="submit" color="brand" label="Create" />
                            </Form>
                        </Tab>
                        <Tab title="SubFeed" color="brand">
                            <Heading style={{ fontSize: 46 }}>New SubFeed</Heading>
                            <Form onSubmit={this.addPlaylist}>
                                <FormField name="name" label="Name" required={true} />
                                <FormField name="description" label="Description" placeholder="Optional" />
                                <Button type="submit" color="brand" label="Create" />
                            </Form>
                        </Tab>
                    </Tabs>
                </Box>
            }
        />)


        const emptyControls = (
            <Box overflow="hidden">
                <Box direction="row" overflow="hidden" style={{ display: "flex", justifyContent: "space-between" }}>
                    {addPlaylist}
                    <Button
                        align="stretch"
                        icon={<Network />}
                        active={music.shuffle}
                        onClick={() => dispatch(shuffle())}
                    />
                    <Button
                        align="stretch"
                        icon={<ChapterPrevious />}
                        disabled={true}
                    />
                    <Button
                        align="stretch"
                        icon={music.playing ? <Pause /> : <Play />}
                        disabled={true}
                    />
                    <Button
                        align="stretch"
                        icon={<ChapterNext />}
                        disabled={true}
                    />
                    <Button
                        align="stretch"
                        icon={<PowerReset />}
                        active={music.repeat}
                        onClick={() => dispatch(repeat())}
                    />
                    <Button
                        style={{ visibility: 'hidden' }}
                        align="stretch"
                        disabled={true} />
                </Box>
                <RangeInput
                    margin={{ top: 'small' }}
                    style={{ width: '100%' }}
                    value={music.timePlayed}
                    min={0}
                    max={1}
                    step={1}
                    disabled={true}
                />
            </Box>
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
        // eslint-disable-next-line no-mixed-operators
        const nextDisabled = disabled || (currentTrack === tracks.length - 1 && (!music.repeat && !music.shuffle)) && music.queue.length === 0

        const controls = (
            <Box overflow="hidden">
                <Box direction="row">
                    <Text className="truncate" margin="small">
                        {trackUndef ? "" : music.currentTrack.title}</Text>
                </Box>
                <Box direction="row" style={{ display: "flex", justifyContent: "space-between" }} overflow="hidden">
                    {addPlaylist}
                    <Button
                        align="stretch"
                        icon={<Network />}
                        active={music.shuffle}
                        onClick={() => dispatch(shuffle())}
                    />
                    <Button
                        icon={<ChapterPrevious />}
                        align="stretch"
                        disabled={disabled || (currentTrack === 0 && (!music.repeat && !music.shuffle))}
                        onClick={() => {
                            dispatch(prevTrack(tracks))
                            this.player.seekTo(0)
                        }
                        }
                    />
                    <Button
                        icon={music.playing ? <Pause /> : <Play />}
                        align="stretch"
                        disabled={disabled}
                        onClick={() => dispatch(togglePlay())}
                    />
                    <Button
                        icon={<ChapterNext />}
                        align="stretch"
                        disabled={nextDisabled}
                        onClick={() => {
                            dispatch(nextTrack())
                            this.player.seekTo(0)
                        }
                        }
                    />

                    <Button
                        icon={<PowerReset className={this.state.buffering ? "spin" : ""} />}
                        active={music.repeat}
                        align="stretch"
                        onClick={() => dispatch(repeat())}
                    />
                    <Button
                        style={{ visibility: 'hidden' }}
                        align="stretch"
                        disabled={true} />
                </Box>
                <RangeInput
                    fill="horizontal"
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
            </Box>
        )

        if (tracks === undefined) {
            return controls
        } else {
            return <Box>

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
                    onPlay={() => {
                        if (!music.playing) {
                            dispatch(togglePlay())
                            dispatch(togglePlay())
                        }
                    }}
                    onBuffer={() => {
                        this.setState({ buffering: true })
                    }}
                    onBufferEnd={() => {
                        this.setState({ buffering: false })
                    }}
                    volume={music.volume / 100}
                    muted={music.muted}
                />
                {controls}
            </Box>
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
    connect((state) => ({
        playlists: state.firestore.ordered.playlists,
        dispatch: state.dispatch,
        music: state.music
    }))
)(Playlist)