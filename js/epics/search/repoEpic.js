import {SearchTypes, searchRepoResult, resetSearch} from '../../reducers/searchReducer';
import {putError} from '../../reducers/comReducer';
import {Observable} from 'rxjs/Rx'

// todo 清空搜索结果
export function searchRepoByQueryEpic(action$, {getState, dispatch}, {get}) {
    return action$.ofType(SearchTypes.SEARCH_REPO)
        .switchMap(action => {
            const {url} = action.payload
            // const headers = {
            //     "Authorization": `token ${getState().userSignInfo.auth.token}`
            // }
            // return get(url, headers)
            return get(url)
                .map(res => res.response || res)
                .map(repos => searchRepoResult(repos.items || [])) // 返回正确结果
                .catch(e => {
                    dispatch(resetSearch()) // 重置搜索状态
                    return Observable.of(putError('网络状况不佳，请稍后在试'))
                        .takeUntil(action$.ofType(SearchTypes.SEARCH_REPO_RESET))
                })
        })
}