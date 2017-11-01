import * as Types from '../actions/types';

export function reposInfo(state = {repos: [], history: [], searching: false}, action) {
    switch (action.type) {
        case Types.SEARCH_REPO:
            const arr = new Set([...state.history, action.payload.query])
            return Object.assign({}, state, {history: [...arr], searching: true})

        case Types.SEARCH_REPO_RESULT:
            return Object.assign({}, state, {repos: action.payload.repos, searching: false})

        case Types.SEARCH_REPO_RESET:
            return Object.assign({}, state, {searching: false})

        default:
            return state
    }
}