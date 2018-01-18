import {SearchTypes, searchRepoResult, resetSearch} from '../../reducers/searchReducer';
import {putError} from '../../reducers/comReducer';
import {Observable} from 'rxjs/Rx'

// todo 清空搜索结果
export function searchRepoByQueryEpic(action$, {getState}, {get}) {
    return action$.ofType(SearchTypes.SEARCH_REPO)
        .switchMap(action => {
            const {url} = action.payload;
            const {auth} = getState().userSignInfo;
            let headers = {};
            if (auth) {
                headers = {"Authorization": `token ${auth.token}`}
            }

            return get(url, headers)
                .map(res => res.response || res)
                .map(repos => searchRepoResult(repos.items || [])) // 返回正确结果
                .catch(e => {
                    return Observable.of(putError('网络状况不佳，请稍后在试')).startWith(resetSearch())
                })
        })
}