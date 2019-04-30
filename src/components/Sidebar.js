import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { Update, LinkDown } from 'grommet-icons'
import firebase from 'firebase'
import history from './helpers/history'
import { setPlaylist, firstPlay } from "../store/actions/musicActions";
import { Box, Text } from 'grommet';

function Playlists({ playlists, dispatch, music }) {

    const menuItems = ["Search", "Home", "Trending", "Favourites"]

    const menuButtons = <Box>{Object.keys(menuItems).map(
        (key, id) => (
            <Box className="sidebarItem" key={menuItems[key]}
                pad={{ left: 'small' }}
                onClick={() => {
                    history.push(`/${menuItems[key].toLowerCase()}`)
                }
                }>
                <Text className="titleContent" margin={{ bottom: '10px', top: '10px' }} >{menuItems[key]}</Text>
            </Box>
        )
    )
    }</Box >

    if (!isLoaded(playlists)) {
        return <Box>
            {menuButtons}
            <Update color="white" size="medium" className="spin" />
        </Box>
    }
    if (isEmpty(playlists)) {
        return <Box>
            {menuButtons}
            <Box fill="vertical" >
                <Text>No playlists found</Text>
                <p>Create one with the <b>+</b> button</p>
                <LinkDown style={{ bottom: 15, position: "absolute" }} color="accent-1" />
            </Box>
        </Box >
    }


    return (
        <Box fill="vertical">
            <Box fill>
                {menuButtons}
                {
                    Object.keys(playlists).map(
                        (key, id) => (
                            <Box className="sidebarItem" key={playlists[key].id}
                                pad={{ left: 'small' }}
                                onClick={() => {
                                    history.push(`/playlists/${playlists[key].id}`)
                                }
                                }
                                onDoubleClick={() => {
                                    dispatch(setPlaylist(playlists[key].id))
                                    dispatch(firstPlay(playlists[key]))
                                }}
                                style={
                                    music.playlist.id === playlists[key].id ? {
                                        borderLeft: "5px #6FFFB0 solid"
                                    } : {
                                        }
                                }>
                                <Text className="titleContent" margin={{ bottom: '10px', top: '10px' }} >{playlists[key].name}</Text>
                            </Box>
                        )
                    )
                }
            </Box>
        </Box>
    )
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
)(Playlists)