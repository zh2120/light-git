export const SearchTypes = {
    SEARCH_REPO: 'SEARCH_REPO', // 请求搜索
    SEARCH_REPO_RESULT: 'SEARCH_REPO_RESULT', // 正确获取搜索结果
    SEARCH_REPO_RESET: 'SEARCH_REPO_RESET', // 搜索失败，重置
};

/**
 * 请求仓库数据
 * @param name 仓库名称
 * @param url
 */
export const searchRepo = ({ name, url }) => ({ type: SearchTypes.SEARCH_REPO, payload: { name, url } });

/**
 * 接受搜索结果
 * @param repos
 */
export const searchRepoResult = (repos) => ({ type: SearchTypes.SEARCH_REPO_RESULT, payload: { repos } });

/**
 * 重置搜索历史
 */
export const resetSearch = () => ({ type: SearchTypes.SEARCH_REPO_RESET });

const searchState = { repos: [], history: [], searching: false };
export default (state = searchState, { type, payload }) => {
    switch (type) {
        case SearchTypes.SEARCH_REPO:
            const arr = state.history.filter(item => item && item.name !== payload.name);
            return { ...state, history: [ ...arr, payload ], searching: true };

        case SearchTypes.SEARCH_REPO_RESULT:
            return { ...state, repos: payload.repos, searching: false };

        case SearchTypes.SEARCH_REPO_RESET:
            // todo repos 没有进行任何的搜索历史
            return { ...searchState };

        default:
            return state
    }
}