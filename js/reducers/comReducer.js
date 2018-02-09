import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation'

export const ComTypes = {
    OPEN_TOAST: 'OPEN_TOAST', // 打开提示
    CLOSE_TOAST: 'CLOSE_TOAST', // 关闭提示
    PUT_ERROR: 'PUT_ERROR',  // 提示错误
    OPEN_MODAL: 'OPEN_MODAL',
    CLOSE_MODAL: 'CLOSE_MODAL'
};

export const reset = (routeName) => NavigationActions.reset({ // 重置路由
    index: 0,
    actions: [ NavigationActions.navigate({ routeName }) ]
});

export const bindActions = actions => dispatch => ({ ...bindActionCreators(actions, dispatch) });

export const back = (routeName) => ({ type: 'Navigation/BACK', routeName });

/**
 * 正常通知
 * @param text
 */
export const openToast = (text) => ({ type: ComTypes.OPEN_TOAST, payload: { text } });

/**
 * 通知错误信息
 * @param message
 * @returns {{type, payload: {message: *, error: boolean}}}
 */
export const putError = (message) => ({ type: ComTypes.PUT_ERROR, payload: { message, error: true } });

/**
 *
 * @param ele
 * @param maskingShow // 遮掩层是否触摸关闭
 */
export const openModal = (ele, maskingShow) => ({ type: ComTypes.OPEN_MODAL, payload: { ele, maskingShow } });

/**
 * 关闭动作框
 */
export const closeModal = () => ({ type: ComTypes.CLOSE_MODAL });

/**
 *
 * @param state
 * {
       text: '', 提示文本
       ele: null, modal 内的组件
       toastOpened: false, 提示框关闭 or 打开
       success: false,
       modalOpen: false,
       maskingShow: false, modal
    }
 * @param type
 * @param payload
 * @returns {*}
 */
export default (state = {
    text: '',
    ele: null,
    success: false,
    modalOpen: false,
    maskingShow: false,
    toastOpened: false
}, { type, payload }) => {
    switch (type) {
        case ComTypes.OPEN_TOAST:
            return { ...state, toastOpened: true, text: payload.text, success: true };

        case ComTypes.CLOSE_TOAST:
            return { ...state, toastOpened: false, success: false };

        case ComTypes.PUT_ERROR:
            if (payload.message) {
                return { ...state, toastOpened: true, text: payload.message, error: true }
            }
            return { ...state, toastOpened: true };

        case ComTypes.OPEN_MODAL: // 打开modal
            return { ...state, modalOpen: true, maskingShow: Boolean(payload.maskingShow), ele: payload.ele || null };

        case ComTypes.CLOSE_MODAL: // 关闭modal
            return { ...state, modalOpen: false, ele: null, maskingShow: false };

        default:
            return state
    }
}