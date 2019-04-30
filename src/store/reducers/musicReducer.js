const initState = {
    playing: false,
    volume: 100,
    muted: false,
    playlist: {},
    queue: [],
    currentTrack: {},
    trackNum: 0,
    timePlayed: 0,
    shuffle: false,
    repeat: false
}

export const findWithAttr = (array, attr, value) => {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

const components = (state = initState, action) => {
    switch (action.type) {
        case 'PLAY':
            return {
                ...state,
                playing: true
            }
        case 'PAUSE':
            return {
                ...state,
                playing: false
            }
        case 'TOGGLE_PLAY':
            return {
                ...state,
                playing: !state.playing
            }
        case 'FIRST_PLAY':
            return {
                ...state,
                playing: true,
                currentTrack: action.playlist.tracks[0],
                timePlayed: 0,
                playlist: action.playlist
            }
        case 'SHUFFLE':
            return {
                ...state,
                shuffle: !state.shuffle
            }
        case 'REPEAT':
            return {
                ...state,
                repeat: !state.repeat
            }
        case 'PROGRESS':
            return {
                ...state,
                timePlayed: action.progress
            }
        case 'CHANGE_VOLUME':
            return {
                ...state,
                volume: action.value
            }
        case 'MUTE_VOLUME':
            return {
                ...state,
                muted: !state.muted
            }
        case 'NEW_TRACK':
            return {
                ...state,
                trackNum: action.trackNum,
                currentTrack: action.playlist.tracks[action.trackNum],
                playing: true,
                timePlayed: 0,
                playlist: action.playlist,
            }
        case 'NEXT_TRACK':
            // tracks in queue
            if (state.queue.length !== 0) {
                return {
                    ...state,
                    currentTrack: state.queue[0],
                    timePlayed: 0,
                    playing: true,
                    queue: state.queue.splice(0, 0)
                }
            }
            // no tracks in queue and last song in list
            if (state.queue.length === 0 && !state.repeat && findWithAttr(state.playlist.tracks, 'ytId', state.currentTrack.ytId) === state.playlist.tracks.length - 1) {
                return {
                    ...initState
                }
            }
            // no queue and more tracks to go
            const next = state.shuffle ? (Math.floor(Math.random() * state.playlist.tracks.length)) : state.playlist.tracks.length - 1 > state.trackNum ? state.trackNum + 1 : 0
            const track = state.playlist.tracks[next]
            return {
                ...state,
                trackNum: next,
                currentTrack: track,
                timePlayed: 0,
                playing: true,
            }
        case 'PREV_TRACK':
            const last = state.trackNum > 0 ? state.trackNum - 1 : 0
            return {
                ...state,
                currentTrack: state.playlist.tracks[last],
                trackNum: last,
                timePlayed: 0,
                playing: true
            }
        case 'SET_PLAYLIST_ID':
            return {
                ...state,
                playlist: action.playlist
            }
        case 'QUEUE_TRACK':
            return {
                ...state,
                queue: [...state.queue, action.track]
            }

        default:
            return state;
    }
}

export default components