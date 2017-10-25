import * as Types from './types';

/**
 * 通知
 * @param toastOpened -> true or false
 * @returns {{type: string, payload: {show: *}}}
 */
export function openToast (text) {
    return {
        type: Types.OPEN_TOAST,
        payload: {text}
    }
}

export function closeToast () {
    return {
        type: Types.CLOSE_TOAST
    }
}

export function putError(message) {
    return {
        type: Types.PUT_ERROR,
        payload: {message, error: true}
    }
}
