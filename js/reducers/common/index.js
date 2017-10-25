import * as Types from '../../actions/types';

export const commons = (state = {toastOpened: false, text: '111tttt1jijgsjo'}, action) => {
    switch (action.type) {
        case Types.OPEN_TOAST: {
            if (action.payload.text) {
                alert(action.payload.text)
                return Object.assign({}, state, {toastOpened: true, text: action.payload.text})
            }
            return Object.assign({}, state, {toastOpened: true})
        }
        case Types.CLOSE_TOAST: {
            return Object.assign({}, state, {toastOpened: false})
        }
        case Types.PUT_ERROR: {
            if (action.payload.message) {
                console.log('putError', action.payload.message)
                return Object.assign({}, state, {toastOpened: true, text: action.payload.message, error: true})
            }
            return Object.assign({}, state, {toastOpened: true})
        }
        default: {
            return state
        }
    }
}