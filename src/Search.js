import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import firebase from 'firebase'
import { firestoreConnect } from 'react-redux-firebase/'
import {TextInput, FormField, Form, Button} from 'grommet'

function Search({ playlists, dispatch }) {
    const searchSuggestions = [
        'Dunkey raps',
        'Taylor Swift cover',
        'JRE',
        'H3H3 Podcast',
        'Game of Thrones intro music',
        'DK Donkey Kong',
        'Django Unchained']
  return (
      <div style={{display: '-webkit-box'}}>
          <Form>
        <FormField name="name" label="" placeholder={searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)] + '...'} />
            <Button type="submit" primary label="Search" />
        </Form>
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
)(Search)