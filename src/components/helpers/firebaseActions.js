import moment from 'moment'
import Request from 'request'
import firebase from 'firebase'
import history from '../helpers/history';
import { findWithAttr } from "../../store/reducers/musicReducer";
const getYouTubeID = require('get-youtube-id')
const youtubeRegex = require('youtube-regex')

export const addFavourite = (track, playlist) => {
    const playlistRef = firebase.firestore().collection('playlists').doc(playlist.id)
    const key = findWithAttr(playlist.tracks, "ytId", track.ytId)
    const updatedTrack = {
        ...playlist.tracks[key],
        favourite: !playlist.tracks[key].favourite
    }
    const updatedTracks = []
    playlist.tracks.forEach((t, i) => {
        if (i === key) {
            updatedTracks.push(updatedTrack)
        } else {
            updatedTracks.push(t)
        }
    })

    playlistRef.set({
        ...playlist,
        tracks: [...updatedTracks]
    })

}

export const addTrack = (songlink, playlist) => {
    if (youtubeRegex().test(songlink)) {
        Request.get(`https://www.googleapis.com/youtube/v3/videos?id=${getYouTubeID(songlink)}&key=${process.env.REACT_APP_apiKey}&part=snippet,contentDetails,statistics,status`, (error, response, body) => {
            if (response.statusCode < 300 && response.statusCode >= 200) {
                const ytInfo = JSON.parse(body).items[0]
                const track = {
                    title: ytInfo.snippet.title,
                    length: (moment.duration(ytInfo.contentDetails.duration).asMilliseconds() / 1000) - 1,
                    ytId: ytInfo.id,
                    favourite: false,
                    artist: ytInfo.snippet.channelTitle,
                    added: Date()
                }
                firebase.firestore().collection('playlists').doc(playlist.id).update({
                    ...playlist,
                    tracks: playlist.tracks.concat(track)
                })
            } else {
                const err = JSON.parse(body)
                console.log({ errorText: `${err.error.code} - ${err.error.message}` })
            }
        });
    }
}

export const removePlaylist = (playlistId) => {
    firebase.firestore().collection('playlists').doc(playlistId).delete()
        .then(
            history.push('/')
        )
}