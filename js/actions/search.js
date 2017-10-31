import * as Types from './types';

export function searchRepo(text) {
    return {
        type: Types.SEARCH_REPO,
        payload: {
            url: '/search/repositories',
            query: text
        }
    }
}

export function searchRepoResult(repos) {
    return {
        type: Types.SEARCH_REPO_RESULT,
        payload: {repos}
    }
}

export function saveHistory(history) {
    return {
        type: Types.SEARCH_HISTORY,
        payload: {history}
    }
}

export function resetSearch() {
    return {
        type: Types.SEARCH_REPO_RESET
    }
}