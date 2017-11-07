import * as Types from '../actions/types';

export function searchInfo(state = {repos: [], history: [], searching: false}, action) {
    switch (action.type) {
        case Types.SEARCH_REPO:
            const arr = state.history.filter(item => item && item.name !== action.payload.name)
            return Object.assign({}, state, {history: [...arr, action.payload], searching: true})

        case Types.SEARCH_REPO_RESULT:
            return Object.assign({}, state, {repos: action.payload.repos, searching: false})

        case Types.SEARCH_REPO_RESET:
            return Object.assign({}, state, {searching: false, repos: []})

        default:
            return state
    }
}