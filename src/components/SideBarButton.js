import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { Menu as MenuIcon } from 'grommet-icons'
import firebase from 'firebase'
import history from './helpers/history'
import { Menu } from 'grommet';

function SideBar({ playlists }) {

    const menuItems = ["Search", "Chart", "Favourites"]

    const menuButtonItems = Object.keys(menuItems).map(
        (key, id) => (
            {
                name: menuItems[key],
                id: menuItems[key]
            }
        )
    )



    if (!isLoaded(playlists)) {
        return (<Menu
            icon={<MenuIcon />}
            style={{ padding: 0, float: 'left' }}
            dropAlign={{ top: 'bottom', left: 'left' }}
            items={[{ label: "Loading..." }]}
        />)
    }
    if (isEmpty(playlists)) {
        return (
            <Menu
                icon={<MenuIcon />}
                style={{ padding: 0, float: 'left' }}
                dropAlign={{ top: 'bottom', right: 'left' }}
                items={[{ label: "Empty" }]}
            />)
    }

    return (
        <Menu
            icon={<MenuIcon />}
            items={[...menuButtonItems, ...playlists].map(
                (item) => (
                    {
                        label: item.name,
                        onClick: () => history.push(`/playlists/${item.id}`),
                    }
                )
            )
            }
        />
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
)(SideBar)