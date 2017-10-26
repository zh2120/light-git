import * as Types from '../../actions/types';

export function reposInfo (state = {repos: [], history: []}, action) {
    switch (action.type) {
        case Types.SEARCH_REPO: {
            const arr = new Set([...state.history, action.payload.query])
            return Object.assign({}, state, {history: [...arr]})
        }
        case Types.SEARCH_REPO_RESULT: {
            // console.log('action.payload -> ',action.payload)

            // return [...action.payload]
            return Object.assign({}, state, {repos: action.payload.repos})
        }
        case Types.SEARCH_HISTORY: {
            return Object.assign({}, state, {history: [...state.history, action.payload.history]})
        }
        default:
            return state
    }
}