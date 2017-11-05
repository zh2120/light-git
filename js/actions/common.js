import * as Types from './types';

/**
 * 通知
 * @param toastOpened -> true or false
 * @returns {{type: string, payload: {show: *}}}
 */
export const openToast = (text) => ({type: Types.OPEN_TOAST, payload: {text}})

/**
 * 关闭通知
 * @returns {{type}}
 */
export const closeToast = () => ({type: Types.CLOSE_TOAST})

/**
 * 通知错误信息
 * @param message
 * @returns {{type, payload: {message: *, error: boolean}}}
 */
export const putError = (message) => ({type: Types.PUT_ERROR, payload: {message, error: true}})

/**
 * 打开动态选择框
 * @param actions 动作数组
 */
export const openActionSheet = (actions) => ({type: Types.OPEN_ACTIONSHEET, payload: {actions}})

/**
 * 关闭动作框
 */
export const closeActionSheet = () => ({type: Types.CLOESE_ACTIONSHEET})