import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { Update, LinkDown } from 'grommet-icons'
import firebase from 'firebase'
import history from './helpers/history'
import { setPlaylist, firstPlay } from "../store/actions/musicActions";

function Playlists({ playlists, dispatch, music }) {

    const menuItems = ["Search", "Home", "Trending", "Favourites"]

    const menuButtons = <div style={{ borderBottom: '1px solid #444' }}>{Object.keys(menuItems).map(
        (key, id) => (
            <div className="sidebarItem track" key={menuItems[key]} onClick={() => {
                history.push(`/${menuItems[key].toLowerCase()}`)
            }
            }>
                <h3 className="titleContent">{menuItems[key]}</h3>
            </div>
        )
    )}</div>

    if (!isLoaded(playlists)) {
        return <div>
            {menuButtons}
            <Update color="white" size="medium" className="spin" />
        </div>
    }
    if (isEmpty(playlists)) {
        return <div>
            {menuButtons}
            <div style={{ marginLeft: 16, height: '100%' }} >
                <h3>No playlists found</h3>
                <p>Create one with the <b>+</b> button</p>
                <LinkDown style={{ bottom: 150, position: "absolute" }} color="accent-1" />
            </div>
        </div >
    }


    return (
        <div style={{ height: "100%" }}>
            <div style={{ height: "100%", width: '100%', float: "left", }}>
                {menuButtons}
                {
                    Object.keys(playlists).map(
                        (key, id) => (
                            <div className="sidebarItem track" key={playlists[key].id} onClick={() => {
                                history.push(`/playlists/${playlists[key].id}`)
                            }
                            }
                                onDoubleClick={() => {
                                    dispatch(setPlaylist(playlists[key].id))
                                    dispatch(firstPlay(playlists[key]))
                                }}
                                style={
                                    music.playlist.id === playlists[key].id ? {
                                        backgroundColor: '#444',
                                        borderLeft: "5px #6FFFB0 solid",
                                        borderRight: "2px #333 solid"
                                    } : {}
                                }>
                                <h3 className="titleContent">{playlists[key].name}</h3>
                            </div>
                        )
                    )
                }
            </div>
        </div>
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