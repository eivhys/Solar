import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import Tracks from '../components/Playlist/Tracks'
import firebase from 'firebase'
import { Button, DropButton, Box, Form, FormField, Heading, Menu, Text } from 'grommet'
import { Play, Add, LinkPrevious, Home } from 'grommet-icons'
import moment from 'moment'
import Request from 'request'
import { findWithAttr } from '../store/reducers/musicReducer'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { firstPlay, setPlaylist, play } from '../store/actions/musicActions';
import history from '../components/helpers/history';
const youtubeRegex = require('youtube-regex')
const getYouTubeID = require('get-youtube-id')

class Playlist extends React.Component {

    state = {
        youtubeLink: ""
    }

    removePlaylist = () => {
        firebase.firestore().collection('playlists').doc(this.props.match.params.id).delete()
            .then(
                history.push('/')
            )
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
                        favourite: false,
                        artist: ytInfo.snippet.channelTitle,
                        added: Date()
                    }
                    console.log(track)
                    const playlist = this.props.playlists[findWithAttr(this.props.playlists, "id", this.props.match.params.id)]
                    firebase.firestore().collection('playlists').doc(this.props.match.params.id).update({
                        ...playlist,
                        tracks: playlist.tracks.concat(track)
                    })
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
                <div style={{ paddingLeft: 24, width: `calc(100% - 24px)`, display: "-webkit-box" }}>
                    <Heading>{playlist.name}</Heading>
                    <Button style={{ marginLeft: 12, marginTop: 44 }}
                        icon={<Play />}
                        label={"Play"}
                        onClick={() => {
                            dispatch(setPlaylist(playlist.id))
                            dispatch(firstPlay(playlist))
                        }}
                    />
                    <DropButton style={{ marginLeft: 12, marginTop: 44 }}
                        icon={<Add />}
                        label="Add track"
                        dropAlign={{ top: 'bottom', right: 'right' }}
                        dropContent={
                            <Box alignSelf="center" pad="large" width="medium" background="light-1">
                                <Form onSubmit={this.addTrack}>
                                    <Heading>New track</Heading>
                                    <FormField name="name" placeholder="Youtube link" onChange={e => this.setState({ youtubeLink: e.target.value })} />
                                    <Button disabled={!youtubeRegex().test(this.state.youtubeLink)} type="submit" color="accent-1" label="Add" />
                                </Form>
                            </Box>
                        }
                    />
                    <Menu
                        style={{ float: 'right', marginTop: 44 }}
                        label="More"
                        dropAlign={{ top: 'bottom', right: 'right' }}
                        items={[
                            { label: 'Share Playlist', onClick: () => { }, disabled: true },
                            { label: 'Remove', onClick: () => this.removePlaylist() },
                        ]}
                    />
                </div>
                <Text style={{ paddingLeft: 24, paddingBottom: 16, display: 'table-cell', }} color="accent-1">{playlist.description}</Text>
                <div style={{ width: '100%', borderBottom: '1px solid #555' }} />
                <Tracks playlist={playlist} playlistId={match.params.id} />
            </div>
        )
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
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(Playlist)