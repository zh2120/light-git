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

export function repoFile(state = {getting: false, file: {}, dirs: []}, action) {
    switch (action.type) {
        case Types.FILE: {
            return {...state, getting: true}
        }
        case Types.FILE_CONTENT: {
            return {...state, getting: false, file: action.payload.file}
        }
        case Types.DIR_CONTENT: {
            return {...state, getting: false, dirs: action.payload.dirs}
        }
        case Types.FILE_CONTENT_DENIED: {
            return {...state, getting: false, file: {}, dirs: []}
        }
        default: return state
    }

}