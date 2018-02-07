import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation'
import { Navigator } from '../views/'

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
 * 关闭通知
 * @returns {{type}}
 */
export const closeToast = () => ({ type: ComTypes.CLOSE_TOAST });

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

const init = 'Home';
const initialState = (routerName) =>
    Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(routerName));

export const navReducer = (state = initialState(init), action) => {
    switch (action.type) {
        case 'Navigation/NAVIGATE':
            const { routes } = state;

            if (action.routeName !== 'RepoDir' && routes[ routes.length - 1 ].routeName === action.routeName) return state;

            return Navigator.router.getStateForAction(action, state);
        case 'Navigation/BACK':
            if (action.routeName) {
                // 寻找栈里，已经存在的场景索引
                const i = state.routes.findIndex(item => item.routeName === action.routeName);

                // 返回从栈底到指定的路由
                return { index: i, routes: state.routes.slice(0, i + 1) }
            }
            // 返回上一层
            if (state.index > 0) return { index: state.index - 1, routes: state.routes.slice(0, state.index) };
            return initialState(init);

        case 'Navigation/SET_PARAMS':
            const nextRoutes = state.routes.map((item) => {
                if (item.key === action.key) { // 对当前页面，设置参数
                    return { ...item, params: { ...item.params, ...action.params } }
                }
                return item
            });
            return { ...state, routes: nextRoutes };
        case 'Navigation/RESET':
            return { ...Navigator.router.getStateForAction(action), config: require('../../config.json') };

        default:
            return state
    }
};
