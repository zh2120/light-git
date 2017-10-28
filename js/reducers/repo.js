import * as Types from '../actions/types';

export function repoContent(state = {getting: false, content: []}, action) {
    switch (action.type) {
        case Types.REPO_HOME: {
            return {...state, getting: true}
        }
        case Types.REPO_HOME_CONTENTS: {
            return {...state, getting: false, content: action.payload.content}
        }
        case Types.REPO_HOME_CONTENTS_DENIED: {
            return {...state, getting: false, content: []}
        }
        default: return state
    }
}