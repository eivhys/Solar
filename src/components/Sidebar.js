import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase/'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { Update, Add } from 'grommet-icons'
import { Box, Button } from 'grommet'
import firebase from 'firebase'
import history from './helpers/history'

function Playlists({ playlists, dispatch }) {
    if (!isLoaded(playlists)) {
        return <Box border={{ color: 'none', size: 'full' }} pad='medium'><Update color="plain" className="spin" size="medium" /></Box>
    }
    if (isEmpty(playlists)) {
        return <div>
            <h3>No playlists found..</h3>
            <Button icon={<Add />} alignSelf="center" label="Create playlist" />
        </div>
    }

    return (
        <div style={{ height: "100%" }}>
            <div style={{ height: "100%", width: '100%', float: "left", }}>
                {
                    Object.keys(playlists).map(
                        (key, id) => (
                            <div className="sidebarItem track" key={playlists[key].id} onClick={() => {
                                history.push(`/playlists/${playlists[key].id}`)
                            }
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
        dispatch: state.dispatch
    }))
)(Playlists)