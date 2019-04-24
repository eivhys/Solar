import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import Tracks from '../components/Playlist/Tracks'
import firebase from 'firebase'
import { Button, Box, Heading } from 'grommet'
import { LinkPrevious, Home } from 'grommet-icons'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'

class Playlist extends React.Component {

    render() {

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

        const favourites = []
        for (const playlist of playlists) {
            for (const track of playlist.tracks) {
                if (track.favourite) {
                    favourites.concat(track)
                }
            }
        }
        console.log(favourites)
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <div style={{ paddingLeft: 24, width: `calc(100% - 24px)`, display: "-webkit-box" }}>
                    <Heading>Favourites</Heading>
                </div>
                <div style={{ width: '100%', borderBottom: '1px solid #555' }} />
                <Tracks playlist={{ name: 'Favourites', id: 'favourites', tracks: [...favourites] }} playlistId={'favourites'} stars={false} options={false} />
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
    connect((state) => ({
        playlists: state.firestore.ordered.playlists,
        music: state.music,
        dispatch: state.dispatch
    }
    ))
)(Playlist)