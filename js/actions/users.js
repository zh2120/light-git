import * as Types from './types';

export function searchUsers(query) {
    return {
        type: Types.SEARCHED_USERS,
        payload: {
            query
        }
    };
}

export function receiveUsers(users) {
    return {
        type: Types.RECEIVED_USERS,
        payload: {
            users
        }
    };
}

/**
 * 用户登录
 * @param auth
 * @returns {{type, payload: {auth: *}}}
 */
export function userSignIn (auth) {
    return {
        type: Types.USER_SIGNIN,
        payload: {auth}
    }
}

/**
 * 接受用户的验证信息
 * @param user
 * @returns {{type, payload: {user: *}}}
 */
export function userSignAccept (auth) {
    return {
        type: Types.USER_SIGNIN_ACCEPT,
        payload: {auth}
    }
}

export function userSignDenied() {
    return {
        type: Types.USER_SIGNIN_DENIED,
    }
}

export function getUserInfo(user) {
    return {
        type: Types.USER_ACCEPT,
        payload: {user}
    }
}

export function deleteAuth() {
    return {
        type: Types.DELETE_AUTH
    }
}

export function exit() {
    return {
        type: Types.EXIT
    }
}

export function clearUser() {
    return {
        type: Types.CLEAR_USER
    }
}

export function clearSearchResults() {
    return {
        type: Types.CLEARED_SEARCH_RESULTS
    };
}

export function requestReposByUser(user) {
    return {
        type: Types.REQUESTED_USER_REPOS,
        payload: {
            user
        }
    };
}

export function receiveUserRepos(user, repos) {
    return {
        type: Types.RECEIVED_USER_REPOS,
        payload: {
            user,
            repos
        }
    };
}

export function checkAdminAccess() {
    return {
        type: Types.CHECKED_ADMIN_ACCESS
    };
}

export function accessDenied() {
    return {
        type: Types.ACCESS_DENIED
    };
}