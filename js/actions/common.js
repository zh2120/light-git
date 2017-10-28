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

/**
 * 关闭通知
 * @returns {{type}}
 */
export function closeToast () {
    return {
        type: Types.CLOSE_TOAST
    }
}

/**
 * 通知错误信息
 * @param message
 * @returns {{type, payload: {message: *, error: boolean}}}
 */
export function putError(message) {
    return {
        type: Types.PUT_ERROR,
        payload: {message, error: true}
    }
}
