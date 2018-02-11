import { SearchTypes, searchRepoResult, resetSearch } from '../../reducers/searchReducer';
import { Observable } from 'rxjs/Rx'

// todo 清空搜索结果
export function searchRepoByQueryEpic(action$, { getState }, { get }) {
    return action$.ofType(SearchTypes.SEARCH_REPO)
        .switchMap(action => {
            const { url } = action.payload;
            const { auth } = getState().userSignInfo;
            let headers = {};
            if (auth) {
                headers = { "Authorization": `token ${auth.token}` }
            }

            return get(url, headers)
                .map(res => res.response || res)
                .map(repos => searchRepoResult(repos.items || [])) // 返回正确结果
                .catch(e => {
                    toast('网络不好，谅解一哈噻');
                    return Observable.of(resetSearch())
                })
        })
}