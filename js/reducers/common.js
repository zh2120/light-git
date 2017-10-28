import * as Types from '../actions/types';

export const commons = (state = {toastOpened: false, text: '', success: false}, action) => {
    switch (action.type) {
        case Types.OPEN_TOAST: {
            return Object.assign({}, state, {toastOpened: true, text: action.payload.text, success: true})
        }
        case Types.CLOSE_TOAST: {
            return Object.assign({}, state, {toastOpened: false, success: false})
        }
        case Types.PUT_ERROR: {
            if (action.payload.message) {
                return Object.assign({}, state, {toastOpened: true, text: action.payload.message, error: true})
            }
            return Object.assign({}, state, {toastOpened: true})
        }
        default: {
            return state
        }
    }
}