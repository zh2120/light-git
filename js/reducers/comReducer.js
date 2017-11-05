import * as Types from '../actions/types';

export const commons = (state = {toastOpened: false, text: '', success: false, actionSheetOpen: false}, action) => {
    switch (action.type) {
        case Types.OPEN_TOAST:
            return {...state, toastOpened: true, text: action.payload.text, success: true}

        case Types.CLOSE_TOAST:
            return {...state, toastOpened: false, success: false}

        case Types.PUT_ERROR:
            if (action.payload.message) {
                return {...state, toastOpened: true, text: action.payload.message, error: true}
            }
            return {...state, toastOpened: true}

        case Types.OPEN_ACTIONSHEET: // 打开actionSheet
            return {...state, actionSheetOpen: true}

        case Types.CLOESE_ACTIONSHEET: // 关闭actionSheet
            return {...state, actionSheetOpen: false}

        default:
            return state
    }
}