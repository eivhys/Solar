import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import Tracks from '../components/Playlist/Tracks'
import firebase from 'firebase'
import { Button, DropButton, Box, Form, FormField, Heading, Menu } from 'grommet'
import { Play, Add, LinkPrevious, Home, Pause } from 'grommet-icons'
import moment from 'moment'
import Request from 'request'
import { findWithAttr } from '../store/reducers/musicReducer'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { togglePlay, setPlaylist } from '../store/actions/musicActions';
const youtubeRegex = require('youtube-regex')
const getYouTubeID = require('get-youtube-id')

class Playlist extends React.Component {

    state = {
        youtubeLink: ""
    }

    addTrack = (e) => {
        if (youtubeRegex().test(this.state.youtubeLink)) {
            Request.get(`https://www.googleapis.com/youtube/v3/videos?id=${getYouTubeID(this.state.youtubeLink)}&key=${process.env.REACT_APP_apiKey}&part=snippet,contentDetails,statistics,status`, (error, response, body) => {
                if (response.statusCode < 300 && response.statusCode >= 200) {
                    const ytInfo = JSON.parse(body).items[0]
                    const track = {
                        title: ytInfo.snippet.title,
                        length: moment.duration(ytInfo.contentDetails.duration).asMilliseconds() / 1000,
                        ytId: ytInfo.id,
                        starred: false,
                        artist: ytInfo.snippet.channelTitle,
                        added: Date()
                    }
                    const playlist = this.props.playlists[findWithAttr(this.props.playlists, "id", this.props.match.params.id)]
                    playlist.tracks.push(track)

                    firebase.firestore().collection('playlists').doc(this.props.match.params.id).set(playlist)
                    this.setState({ youtubeLink: "" })
                } else {
                    const err = JSON.parse(body)
                    console.log({ errorText: `${err.error.code} - ${err.error.message}` })
                }
            });
        }
    }

    render() {

        const { playlists, match, music, dispatch } = this.props

        if (!isLoaded(playlists)) {
            return <Heading>Loading...</Heading>
        }
        if (isEmpty(playlists)) {
            return <div>
                <Heading>
                    Oof.. Couldn't find your content
                </Heading></div>
        }

        const noPlaylists = (
            <Box>
                <h1>
                    Ouch!
            </h1>
                <h3>Seems there wasn't a playlist here :-/</h3>
                <Button style={{ marginLeft: 10, marginTop: 16 }}
                    icon={<LinkPrevious />}
                    label="Previous"
                    onClick={() => { }}
                />
                <Button style={{ marginLeft: 10, marginTop: 16 }}
                    icon={<Home />}
                    label="Home"
                    onClick={() => { }}
                />
            </Box>
        )

        if (playlists === undefined) {
            return noPlaylists
        }

        const playlist = playlists.find(p => p.id === match.params.id)

        if (playlist === undefined) {
            return noPlaylists
        }

        return (
            <div style={{ height: "100%", width: "100%" }}>
                <div style={{ width: "100%", display: "-webkit-box" }}>
                    <Heading style={{ marginLeft: 20 }}>{playlist.name}</Heading>
                    <Button style={{ marginLeft: 10, marginTop: 44 }}
                        icon={music.playing ? <Pause /> : <Play />}
                        label={music.playing ? "Pause" : "Play"}
                        onClick={() => {
                            dispatch(setPlaylist(playlist.id))
                            dispatch(togglePlay())
                        }}
                    />
                    <DropButton style={{ marginLeft: 10, marginTop: 44 }}
                        icon={<Add />}
                        label="Add track"
                        dropAlign={{ top: 'bottom', right: 'right' }}
                        dropContent={
                            <Box alignSelf="center" pad="large" width="medium" background="dark-2">
                                <Form onSubmit={this.addTrack}>
                                    <FormField name="name" label="New track" onChange={e => this.setState({ youtubeLink: e.target.value })} />
                                    <Button disabled={!youtubeRegex().test(this.state.youtubeLink)} type="submit" primary label="Add" />
                                </Form>
                            </Box>
                        }
                    />
                    <Menu
                        style={{ float: 'right' }}
                        label="More"
                        dropAlign={{ top: 'bottom', right: 'right' }}
                        items={[
                            { label: 'Share track', onClick: () => { } },
                            { label: 'Download', onClick: () => { } },
                            { label: 'Remove from playlist', onClick: () => { } },
                        ]}
                    />
                </div>
                <h3 style={{ marginLeft: 20 }}>{playlist.description}</h3>
                <Tracks playlist={playlist} playlistId={match.params.id} />
            </div>
        )
    }

}

export default compose(
    firestoreConnect(() => ['playlists']), // or { collection: 'todos' }
    connect((state, props) => ({
        playlists: state.firestore.ordered.playlists,
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(Playlist)