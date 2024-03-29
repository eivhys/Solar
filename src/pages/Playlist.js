import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import Tracks from '../components/Playlist/Tracks'
import firebase from 'firebase'
import { Button, DropButton, Box, Form, FormField, Heading, Menu, Text, ResponsiveContext } from 'grommet'
import { Play, Add, LinkPrevious, Home, More } from 'grommet-icons'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { firstPlay, setPlaylist, } from '../store/actions/musicActions';
import { removePlaylist, addTrack } from "../components/helpers/firebaseActions";
const youtubeRegex = require('youtube-regex')

class Playlist extends React.Component {

    state = {
        youtubeLink: ""
    }





    render() {

        const { playlists, match, dispatch } = this.props

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

        const buttonMargin = { left: 'small' }

        return (
            <Box full>
                <Box >
                    <Box fill align="baseline" >
                        <ResponsiveContext.Consumer>
                            {
                                (size) => size !== "small" ? (
                                    <Heading>{playlist.name}
                                        <Button
                                            margin={buttonMargin}
                                            icon={<Play />}
                                            label={"Play"}
                                            color="brand"
                                            onClick={() => {
                                                dispatch(setPlaylist(playlist.id))
                                                dispatch(firstPlay(playlist))
                                            }}
                                        />
                                        <DropButton
                                            margin={buttonMargin}
                                            color="brand"
                                            style={{ marginBottom: 5 }}
                                            icon={<Add />}
                                            label="Add track"
                                            dropAlign={{ top: 'bottom', right: 'right' }}
                                            dropContent={
                                                <Box alignSelf="center" pad="large" width="medium" background="dark-2">
                                                    <Form onSubmit={() => addTrack(this.state.youtubeLink, playlist)}>
                                                        <Heading>New track</Heading>
                                                        <FormField name="name" placeholder="Youtube link" onChange={e => this.setState({ youtubeLink: e.target.value })} />
                                                        <Button disabled={!youtubeRegex().test(this.state.youtubeLink)} type="submit" color="brand" label="Add" />
                                                    </Form>
                                                </Box>
                                            }
                                        />
                                        <Menu
                                            label="More"
                                            dropBackground="dark-2"
                                            margin={{ ...buttonMargin }}
                                            icon={<More />}
                                            items={[
                                                { label: 'Share Playlist', onClick: () => { }, disabled: true },
                                                { label: 'Remove', onClick: () => removePlaylist(match.params.id) },
                                            ]}
                                        />
                                    </Heading>
                                ) :
                                    (
                                        <Box fill align="center" alignContent="center">
                                            <Heading
                                                alignSelf="center"
                                                className="truncate">{playlist.name}
                                            </Heading>
                                            <Button
                                                icon={<Play />}
                                                label={"Play"}
                                                color="brand"
                                                style={{ marginBottom: 5 }}
                                                onClick={() => {
                                                    dispatch(setPlaylist(playlist.id))
                                                    dispatch(firstPlay(playlist))
                                                }}
                                            />
                                            <DropButton
                                                style={{ marginBottom: 5 }}
                                                color="brand"
                                                icon={<Add />}
                                                label="Add track"
                                                dropContent={
                                                    <Box alignSelf="center" pad="large" width="medium" background="dark-2">
                                                        <Form onSubmit={() => addTrack(this.state.youtubeLink, playlist)}>
                                                            <Heading>New track</Heading>
                                                            <FormField name="name" placeholder="Youtube link" onChange={e => this.setState({ youtubeLink: e.target.value })} />
                                                            <Button disabled={!youtubeRegex().test(this.state.youtubeLink)} type="submit" color="brand" label="Add" />
                                                        </Form>
                                                    </Box>
                                                }
                                            />
                                            <Menu
                                                alignSelf="center"
                                                icon={<More />}
                                                dropBackground="dark-2"
                                                dropAlign={{ top: 'bottom', right: 'right' }}
                                                items={[
                                                    { label: 'Share Playlist', onClick: () => { }, disabled: true },
                                                    { label: 'Remove', onClick: () => removePlaylist(match.params.id) },
                                                ]}
                                            />
                                        </Box>
                                    )
                            }
                        </ResponsiveContext.Consumer>
                    </Box>
                </Box>
                <ResponsiveContext.Consumer>
                    {(size) => size !== "small" && playlist.description.length > 0 && (<Text color="brand" className="truncate">{playlist.description}</Text>)}
                </ResponsiveContext.Consumer>
                <Box border={{ color: 'dark-2', size: 'small', side: 'bottom' }} />
                <Tracks playlist={playlist} playlistId={match.params.id} />
            </Box >
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