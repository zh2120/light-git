import * as Types from './types';

export function searchRepo (text) {
    return {
        type: Types.SEARCH_REPO,
        payload: {
            url: '/search/repositories?',
            query: text
        }
    }
}

export function searchRepoResult (repos) {
    return {
        type: Types.SEARCH_REPO_RESULT,
        payload: {
            repos
        }
    }
}