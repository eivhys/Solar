export const create = (playlist) => ({
    type: 'CREATE',
    playlist
})

export const play = () => ({
    type: 'PLAY',
})

export const pause = () => ({
    type: 'PAUSE',
})

export const togglePlay = () => ({
    type: 'TOGGLE_PLAY',
})

export const changeVolume = (n) => ({
    type: 'CHANGE_VOLUME',
    value: n
})

export const muteVolume = () => ({
    type: 'MUTE_VOLUME'
})

export const progress = (n) => ({
    type: 'PROGRESS',
    progress: n
})

export const repeat = () => ({
    type: 'REPEAT',
})

export const shuffle = () => ({
    type: 'SHUFFLE',
})

export const nextTrack = (tracks) => ({
    type: 'NEXT_TRACK',
    tracks
})

export const prevTrack = (tracks) => ({
    type: 'PREV_TRACK',
    tracks
})

export const newTrack = (trackNum, playlistId, playlistLength) => ({
    type: 'NEW_TRACK',
    trackNum,
    playlistId,
    playlistLength

})

export const removePlaylist = (playlist) => ({
    type: 'REMOVE_PLAYLIST'
})

export const addTrack = (track) => ({
    type: 'ADD_TRACK',
    track
})

export const removeTrack = (track) => ({
    type: 'REMOVE_TRACK',
    track
})

export const starTrack = (track) => ({
    type: 'STAR_TRACK',
    track
})

export const setPlaylist = (playlistId) => ({
    type: 'SET_PLAYLIST_ID',
    playlistId
})