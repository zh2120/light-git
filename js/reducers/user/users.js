import * as Types from '../../actions/types';

export function userInfo(state = {user: null}, action) {
    switch (action.type) {
        case Types.USER_ACCEPT:
            return {...state, ...action.payload};
        case Types.CLEAR_USER:
            return {user: null};
        default:
            return state;
    }
}

export function userSignInfo (state = {signInPending: false, signed: false, auth: null}, action) {
    switch (action.type) {
        case Types.USER_SIGNIN: {
            return Object.assign({}, state, {signInPending: true, basic: action.payload.auth})
        }
        case Types.USER_SIGNIN_ACCEPT: {
            return Object.assign({}, state, {signInPending: false, signed: true, ...action.payload})
        }
        case Types.USER_SIGNIN_DENIED: {
            return Object.assign({}, state, {signInPending: false, signed: false, ...action.payload})
        }
        case Types.EXIT: {
            return Object.assign({}, state, {signInPending: false, signed: false, auth: null})
        }
        default:
            return state
    }
}