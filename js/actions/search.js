import * as Types from './types';

export function searchRepo({name, url}) {
    return {
        type: Types.SEARCH_REPO,
        payload: {name, url}
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