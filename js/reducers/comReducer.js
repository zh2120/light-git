import {bindActionCreators} from 'redux';

export const comTypes = {
    OPEN_TOAST: 'OPEN_TOAST', // 打开提示
    CLOSE_TOAST: 'CLOSE_TOAST', // 关闭提示
    PUT_ERROR: 'PUT_ERROR',  // 提示错误
    OPEN_ACTIONSHEET: 'OPEN_ACTIONSHEET',
    CLOESE_ACTIONSHEET: 'CLOESE_ACTIONSHEET'
}

export const bindActions = actions => dispatch => ({...bindActionCreators(actions, dispatch)})

export const back = (routeName) => ({type: 'Navigation/BACK', routeName})

/**
 * 通知
 * @param toastOpened -> true or false
 * @returns {{type: string, payload: {show: *}}}
 */
export const openToast = (text) => ({type: comTypes.OPEN_TOAST, payload: {text}})

/**
 * 关闭通知
 * @returns {{type}}
 */
export const closeToast = () => ({type: comTypes.CLOSE_TOAST})

/**
 * 通知错误信息
 * @param message
 * @returns {{type, payload: {message: *, error: boolean}}}
 */
export const putError = (message) => ({type: comTypes.PUT_ERROR, payload: {message, error: true}})

/**
 * 打开动态选择框
 * @param actions 动作数组
 */
export const openActionSheet = (actions) => ({type: comTypes.OPEN_ACTIONSHEET, payload: {actions}})

/**
 * 关闭动作框
 */
export const closeActionSheet = () => ({type: comTypes.CLOESE_ACTIONSHEET})

export default (state = {toastOpened: false, text: '', success: false, actionSheetOpen: false}, action) => {
    switch (action.type) {
        case comTypes.OPEN_TOAST:
            return {...state, toastOpened: true, text: action.payload.text, success: true}

        case comTypes.CLOSE_TOAST:
            return {...state, toastOpened: false, success: false}

        case comTypes.PUT_ERROR:
            if (action.payload.message) {
                return {...state, toastOpened: true, text: action.payload.message, error: true}
            }
            return {...state, toastOpened: true}

        case comTypes.OPEN_ACTIONSHEET: // 打开actionSheet
            return {...state, actionSheetOpen: true}

        case comTypes.CLOESE_ACTIONSHEET: // 关闭actionSheet
            return {...state, actionSheetOpen: false}

        default:
            return state
    }
}