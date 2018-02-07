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
    GET_PRO_LIST: 'GET_PRO_LIST', // 获取用户的仓库列表
    PRO_LIST: 'PRO_LIST',
    ERR_PRO_LIST: 'ERR_PRO_LIST', // 出错处理
};

/**
 * 用户登录
 * @param auth
 * @returns {{type, payload: {auth: *}}}
 */
export const userSignIn = (auth) => ({ type: UserTypes.USER_SIGNIN, payload: { auth } });

/**
 * 接受用户的验证信息
 * @param auth 已通过授权
 * @returns {{type, payload: {user: *}}}
 */
export const userSignAccept = (auth) => ({ type: UserTypes.USER_SIGNIN_ACCEPT, payload: { auth } });

/**
 * 用户验证失败
 */
export const userSignDenied = () => ({ type: UserTypes.USER_SIGNIN_DENIED});

/**
 * 获取用户基本信息
 * @param user 用户信息
 */
export const getUserInfo = (user) => ({ type: UserTypes.USER_ACCEPT, payload: { user } });

/**
 * 删除授权
 * @param id 用户ID
 */
export const deleteAuth = (id) => ({ type: UserTypes.DELETE_AUTH, payload: { id } });

/**
 * 清空用户信息
 */
export const clearUser = () => ({ type: UserTypes.CLEAR_USER });

/**
 * 检查许可是否有效
 */
export const getCheckedAuth = () => ({ type: UserTypes.GET_CHECK_AUTH });

/**
 * 获取指定用户名的仓库列表
 * @param username 指定用户名
 * @param page
 */
export const getRepoList = ({ username = '', page = 1 }) => ({
    type: UserTypes.GET_PRO_LIST,
    payload: { username, page }
});

/**
 * 接受用户的仓库列表
 * @param list
 */
export const repoList = (list) => ({ type: UserTypes.PRO_LIST, payload: { list } });

/**
 * 出错
 */
export const errRepoList = () => ({ type: UserTypes.ERR_PRO_LIST });
/**
 * 用户信息库
 * @param state
 * @param action
 * @returns {*}
 */
const userState = { user: null, proList: null};
export const userInfo = (state = userState, { type, payload }) => {
    switch (type) {
        case UserTypes.USER_ACCEPT:
            return { ...state, ...payload};

        case UserTypes.CLEAR_USER:
            return { ...userState };

        case UserTypes.PRO_LIST:
            return { ...state, proList: payload.list};

        case UserTypes.ERR_PRO_LIST:
            return { ...state, ...payload };

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
const signState = { signInPending: false, signed: false, auth: null };
export const userSignInfo = (state = signState, { type, payload }) => {
    switch (type) {
        case UserTypes.USER_SIGNIN:
            return { ...state, signInPending: true, basic: payload.auth };

        case UserTypes.USER_SIGNIN_ACCEPT:
            return { ...state, signInPending: false, signed: true, ...payload };

        case UserTypes.USER_SIGNIN_DENIED:
            return { ...signState, ...payload };

        default:
            return state
    }
};
