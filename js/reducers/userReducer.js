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
    GET_REPO_LIST: 'GET_REPO_LIST', // 获取用户的仓库列表
    REPO_LIST: 'REPO_LIST',
    ERR_REPO_LIST: 'ERR_REPO_LIST', // 出错处理
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
export const getCheckedAuth = () => ({type: UserTypes.GET_CHECK_AUTH});

/**
 * 获取指定用户名的仓库列表
 * @param username 指定用户名
 */
export const getRepoList = ({username}) => ({type: UserTypes.GET_REPO_LIST, payload: {username}});

/**
 * 接受用户的仓库列表
 * @param list
 */
export const repoList = (list) => ({type: UserTypes.REPO_LIST, payload: {list}});

/**
 * 出错
 */
export const errRepoList = () => ({type: UserTypes.ERR_REPO_LIST});
/**
 * 用户信息库
 * @param state
 * @param action
 * @returns {*}
 */
export const userInfo = (state = {user: null, repoList: null}, {type, payload}) => {
    switch (type) {
        case UserTypes.USER_ACCEPT:
            return {...state, ...payload};

        case UserTypes.CLEAR_USER:
            return {...state, user: null};

        case UserTypes.REPO_LIST:
            return {...state, repoList: payload.list};

        case UserTypes.ERR_REPO_LIST:
            return {...state, repoList: null};

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
export const userSignInfo = (state = {signInPending: false, signed: false, auth: null}, {type, payload}) => {
    switch (type) {
        case UserTypes.USER_SIGNIN:
            return {...state, signInPending: true, basic: payload.auth};

        case UserTypes.USER_SIGNIN_ACCEPT:
            return {...state, signInPending: false, signed: true, ...payload};

        case UserTypes.USER_SIGNIN_DENIED:
            return {...state, signInPending: false, signed: false, auth: null};

        default:
            return state
    }
};
