import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import FavouriteTracks from '../components/Playlist/FavouriteTracks'
import firebase from 'firebase'
import { Button, Box, Heading } from 'grommet'
import { LinkPrevious, Home, Play } from 'grommet-icons'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { setPlaylist, firstPlay } from "../store/actions/musicActions";

class Playlist extends React.Component {

    getFavourites() {
        const favourites = {
            id: 'favourites',
            name: 'Favourites',
            description: 'A collection of your favourite songs!',
            tracks: []
        }
        for (let p = 0; p < this.props.playlists.length; p++) {
            const playlist = this.props.playlists[p];
            for (let t = 0; t < playlist.tracks.length; t++) {
                const track = playlist.tracks[t];
                if (track.favourite) {
                    favourites.tracks.push({ ...track, origin: playlist.id })
                }
            }
        }
        return favourites
    }

    render() {

        const buttonMargin = { left: 'small' }
        const { playlists } = this.props

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
        const favourites = this.getFavourites()
        return (
            <Box fill>
                <Box margin={{ left: 'small', right: 'small' }} >
                    <Box fill align="baseline" overflow="hidden">
                        <Heading>Favourites
                            <Button
                                margin={buttonMargin}
                                icon={<Play />}
                                label={"Play"}
                                onClick={() => {
                                    this.props.dispatch(setPlaylist(favourites.id))
                                    this.props.dispatch(firstPlay(favourites))
                                }}
                            />
                        </Heading>
                    </Box>
                </Box>
                <Box style={{ width: '100%', borderBottom: '1px solid #555' }} />
                <FavouriteTracks playlist={favourites} playlistId={'favourites'} stars={false} options={false} />
            </Box>
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
    connect((state) => ({
        playlists: state.firestore.ordered.playlists,
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(Playlist)