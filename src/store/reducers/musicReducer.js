const initState = {
    playing: false,
    volume: 100,
    muted: false,
    playlistId: "",
    playlistLength: 0,
    playlist: [],
    queue: [],
    currentTrack: 0,
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
        case 'PLAT_FIRST':
            return {
                ...state,
                playing: true,
                currentTrack: 0,
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
                currentTrack: action.trackNum,
                playing: true,
                timePlayed: 0,
                playlistId: action.playlistId,
                playlistLength: action.playlistLength,
                queue: state.queue.pop()
            }
        case 'NEXT_TRACK':
            return {
                ...state,
                currentTrack: state.shuffle ? (Math.floor(Math.random() * state.playlistLength)) : state.playlistLength - 1 > state.currentTrack ? state.currentTrack + 1 : 0,
                timePlayed: 0,
                playing: true,
                queue: state.queue.pop()
            }
        case 'PREV_TRACK':
            return {
                ...state,
                currentTrack: state.currentTrack > 0 ? state.currentTrack - 1 : 0,
                timePlayed: 0,
                playing: true
            }
        case 'SET_PLAYLIST_ID':
            return {
                ...state,
                playlistId: action.playlistId
            }

        default:
            return state;
    }
}

export default components