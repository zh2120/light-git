export const SearchTypes = {
    SEARCH_REPO: 'SEARCH_REPO', // 请求搜索
    SEARCH_REPO_RESULT: 'SEARCH_REPO_RESULT', // 正确获取搜索结果
    SEARCH_REPO_RESET: 'SEARCH_REPO_RESET', // 搜索失败，重置
}

/**
 * 请求仓库数据
 * @param name 仓库名称
 * @param url
 */
export const searchRepo = ({name, url}) => ({type: SearchTypes.SEARCH_REPO, payload: {name, url}})

/**
 * 接受搜索结果
 * @param repos
 */
export const searchRepoResult = (repos) => ({type: SearchTypes.SEARCH_REPO_RESULT, payload: {repos}})

/**
 * 重置搜索历史
 */
export const resetSearch = () => ({type: SearchTypes.SEARCH_REPO_RESET})


export default (state = {repos: [], history: [], searching: false}, action) => {
    switch (action.type) {
        case SearchTypes.SEARCH_REPO:
            const arr = state.history.filter(item => item && item.name !== action.payload.name)
            return Object.assign({}, state, {history: [...arr, action.payload], searching: true})

        case SearchTypes.SEARCH_REPO_RESULT:
            return Object.assign({}, state, {repos: action.payload.repos, searching: false})

        case SearchTypes.SEARCH_REPO_RESET:
            return Object.assign({}, state, {searching: false, repos: []})

        default:
            return state
    }
}