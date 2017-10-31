export const SEARCHED_USERS = 'SEARCHED_USERS'
export const RECEIVED_USERS = 'RECEIVED_USERS'
export const CLEARED_SEARCH_RESULTS = 'CLEARED_SEARCH_RESULTS'

export const REQUESTED_USER_REPOS = 'REQUESTED_USER_REPOS'
export const RECEIVED_USER_REPOS = 'RECEIVED_USER_REPOS'

export const CHECKED_ADMIN_ACCESS = 'CHECKED_ADMIN_ACCESS'
export const ACCESS_DENIED = 'ACCESS_DENIED'

// 通用
export const OPEN_TOAST = 'OPEN_TOAST' // 打开提示
export const CLOSE_TOAST = 'CLOSE_TOAST'
export const PUT_ERROR = 'PUT_ERROR' // 提示错误

// 登陆
export const USER_SIGNIN = 'USER_SIGNIN' //  授权登录
export const USER_SIGNIN_INFO = 'USER_SIGNIN_INFO' // 登录输入
export const USER_SIGNIN_ACCEPT = 'USER_SIGNIN_ACCEPT' //  登录接受
export const USER_SIGNIN_DENIED = 'USER_SIGNIN_DENIED'  // 登录被拒绝

// 获取用户信息
export const GET_USER_INFO = 'GET_USER_INFO' // 获取用户信息
export const USER_ACCEPT = 'USER_ACCEPT'
export const USER_DENIED = 'USER_DENIED'
export const CLEAR_AUTH = 'CLEAR_AUTH'
export const CLEAR_USER = 'CLEAR_USER'

// 删除授权
export const DELETE_AUTH = 'DELETE_AUTH'
export const EXIT = 'EXIT'

// 搜索
export const SEARCH_REPO = 'SEARCH_REPO'
export const SEARCH_REPO_RESULT = 'SEARCH_REPO_RESULT'
export const SEARCH_REPO_RESET = 'SEARCH_REPO_RESET'
export const SEARCH_HISTORY = 'SEARCH_HISTORY' // 搜索历史

// 仓库内容相关
export const REPO_HOME = 'REPO_HOME' // 默认请求
export const REPO_HOME_CONTENTS = 'REPO_HOME_CONTENTS' // 仓库内容，默认成功，取得目录或者文件
export const REPO_HOME_CONTENTS_DENIED = 'REPO_HOME_CONTENTS_DENIED' // 请求内容失败，被拒绝，重置状态

export const FILE = 'FILE' // 请求文件内容
export const FILE_CONTENT = 'FILE_CONTENT' // 仓库内容文件
export const FILE_CONTENT_DENIED = 'FILE_CONTENT_DENIED' // 请求文件内容失败，被拒绝，重置
export const DIR_CONTENT = 'DIR_CONTENT' // 目录