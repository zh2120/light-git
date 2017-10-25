import * as Types from '../../actions/types';

export function searchedRepos (state = {repos: []}, action) {
    switch (action.type) {
        case Types.SEARCH_REPO_RESULT: {
            console.log('action.payload -> ',action.payload)

            return Object.assign({}, state, action.payload)
        }
        default:
            return state
    }
}