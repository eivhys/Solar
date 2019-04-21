import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Button, RangeInput, DropButton, Box, Form, FormField } from 'grommet'
import { Play, ChapterNext, ChapterPrevious, PowerReset, Network, Pause, VolumeMute, Volume, Update, Add } from 'grommet-icons'
import { progress, togglePlay, muteVolume, changeVolume, shuffle, prevTrack, nextTrack, repeat } from '../store/actions/musicActions';
import ReactPlayer from 'react-player'
import { firestoreConnect } from 'react-redux-firebase/'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'

class Playlist extends React.Component {

    state = { buffering: false }

    ref = player => {
        this.player = player
    }

    toMMSS = (sec_num) => {
        console.log(sec_num)
        sec_num = parseInt(this, 10); // don't forget the second param
        const hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return minutes + ':' + seconds;
    }

    render() {
        const { music, dispatch, playlists } = this.props
        const addPlaylist = (<DropButton style={{ marinLeft: 10 }}
            icon={<Add />}
            label=""
            dropAlign={{ bottom: 'bottom', left: 'left' }}
            dropContent={
                <Box elevation="xlarge" alignSelf="center" pad="large" width="medium" background="light-1">
                    <Form onSubmit={this.addTrack}>
                        <FormField name="name" label="New playlist" onChange={e => this.setState({ youtubeLink: e.target.value })} />
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

        let activePlaylist = playlists.find(p => {
            return p.id === music.playlistId
        })

        if (activePlaylist === undefined) {
            return emptyControls
        }

        const tracks = activePlaylist.tracks
        const currentTrack = music.currentTrack
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
                        disabled={disabled || (currentTrack === tracks.length - 1 && (!music.repeat && !music.shuffle))}
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
                                    {trackUndef ? "" : tracks[currentTrack].title}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <RangeInput
                    style={{ width: '100%', marginTop: trackUndef ? 11.94 : 0 }}
                    value={music.timePlayed}
                    min={0}
                    max={trackUndef ? 1 : tracks[currentTrack].length}
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
                    url={`https://www.youtube.com/watch?v=${!trackUndef ? tracks[currentTrack].ytId : ""}`}
                    playing={music.playing}
                    onProgress={(e) => dispatch(progress(e.playedSeconds))}
                    onEnded={() => {
                        dispatch(nextTrack())
                        this.player.seekTo(0)
                    }
                    }
                    onBuffer={() => this.setState({ buffering: true })}
                    onBufferEnd={() => this.setState({ buffering: false })}
                    volume={music.volume / 100}
                    muted={music.muted}
                    onSeek={e => console.log('onSeek', e)}
                />
                {controls}
            </div>
        }
    }

}

export default compose(
    firestoreConnect(() => ['playlists']), // or { collection: 'todos' }
    connect((state, props) => ({
        playlists: state.firestore.ordered.playlists,
        dispatch: state.dispatch,
        music: state.music
    }))
)(Playlist)