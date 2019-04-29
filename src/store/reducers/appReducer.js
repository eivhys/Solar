const initState = {
    sidebarWidth: 230
}

const components = (state = initState, action) => {
    switch (action.type) {
        case 'RESIZE_SIDEBAR':
            return {
                ...state,
                sidebarWidth: action.width
            }

        default:
            return state;
    }
}

export default components