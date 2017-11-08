export const searchTypes = {
    SEARCH_REPO: 'SEARCH_REPO', // 请求搜索
    SEARCH_REPO_RESULT: 'SEARCH_REPO_RESULT', // 正确获取搜索结果
    SEARCH_REPO_RESET: 'SEARCH_REPO_RESET', // 搜索失败，重置
    SEARCH_HISTORY: 'SEARCH_HISTORY' // 保存历史
}

/**
 * 请求仓库数据
 * @param name 仓库名称
 * @param url
 */
export const searchRepo = ({name, url}) => ({type: searchTypes.SEARCH_REPO, payload: {name, url}})

/**
 * 接受搜索结果
 * @param repos
 */
export const searchRepoResult = (repos) => ({type: searchTypes.SEARCH_REPO_RESULT, payload: {repos}})

/**
 * 保存搜索历史
 * @param history
 */
export const saveHistory = (history) => ({type: searchTypes.SEARCH_HISTORY, payload: {history}})

/**
 * 重置搜索历史
 */
export const resetSearch = () => ({type: searchTypes.SEARCH_REPO_RESET})


export default (state = {repos: [], history: [], searching: false}, action) => {
    switch (action.type) {
        case searchTypes.SEARCH_REPO:
            const arr = state.history.filter(item => item && item.name !== action.payload.name)
            return Object.assign({}, state, {history: [...arr, action.payload], searching: true})

        case searchTypes.SEARCH_REPO_RESULT:
            return Object.assign({}, state, {repos: action.payload.repos, searching: false})

        case searchTypes.SEARCH_REPO_RESET:
            return Object.assign({}, state, {searching: false, repos: []})

        default:
            return state
    }
}