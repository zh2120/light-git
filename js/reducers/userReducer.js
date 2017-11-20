export const UserTypes = {
    CLEAR_AUTH: 'CLEAR_AUTH',
    CLEAR_USER: 'CLEAR_USER',
    DELETE_AUTH: 'DELETE_AUTH',
    USER_DENIED: 'USER_DENIED',
    USER_SIGNIN: 'USER_SIGNIN', //  授权登录
    USER_ACCEPT: 'USER_ACCEPT',
    GET_USER_INFO: 'GET_USER_INFO', // 获取用户信息
    USER_SIGNIN_INFO: 'USER_SIGNIN_INFO', // 登录输入
    USER_SIGNIN_ACCEPT: 'USER_SIGNIN_ACCEPT', //  登录接受
    USER_SIGNIN_DENIED: 'USER_SIGNIN_DENIED',  // 登录被拒绝
    GET_CHECK_AUTH: 'GET_CHECK_AUTH',
};

/**
 * 用户登录
 * @param auth
 * @returns {{type, payload: {auth: *}}}
 */
export const userSignIn = (auth) => ({type: UserTypes.USER_SIGNIN, payload: {auth}});

/**
 * 接受用户的验证信息
 * @param auth 已通过授权
 * @returns {{type, payload: {user: *}}}
 */
export const userSignAccept = (auth) => ({type: UserTypes.USER_SIGNIN_ACCEPT, payload: {auth}});

/**
 * 用户验证失败
 */
export const userSignDenied = () => ({type: UserTypes.USER_SIGNIN_DENIED});

/**
 * 获取用户基本信息
 * @param user 用户信息
 */
export const getUserInfo = (user) => ({type: UserTypes.USER_ACCEPT, payload: {user}});

/**
 * 删除授权
 * @param id 用户ID
 */
export const deleteAuth = ({id}) => ({type: UserTypes.DELETE_AUTH, payload: {id}});

/**
 * 清空用户信息
 */
export const clearUser = () => ({type: UserTypes.CLEAR_USER});

/**
 * 检查许可是否有效
 */
export const getCheckAuth = () => ({type: UserTypes.GET_CHECK_AUTH});

/**
 * 用户信息库
 * @param state
 * @param action
 * @returns {*}
 */
export const userInfo = (state = {user: null}, action) => {
    switch (action.type) {
        case UserTypes.USER_ACCEPT:
            return {...state, ...action.payload};
        case UserTypes.CLEAR_USER:
            return {...state, user: null};

        default:
            return state;
    }
};

/**
 * 用户授权库
 * @param state
 * @param action
 * @returns {*}
 */
export const userSignInfo = (state = {signInPending: false, signed: false, auth: null}, action) => {
    switch (action.type) {
        case UserTypes.USER_SIGNIN:
            return {...state, signInPending: true, basic: action.payload.auth};

        case UserTypes.USER_SIGNIN_ACCEPT:
            return {...state, signInPending: false, signed: true, ...action.payload};

        case UserTypes.USER_SIGNIN_DENIED:
            return {...state, signInPending: false, signed: false, auth: null};

        default:
            return state
    }
};
