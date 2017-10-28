import * as Types from '../../actions/types';
import {searchRepoResult, resetSearch} from '../../actions';
import {openToast, putError} from '../../actions/common';
import {Observable} from 'rxjs/Rx'

const getParams = (params) => {
    if (params) {
        const paramsArray = []
        Object.keys(params).map(key => paramsArray.push(key + '=' + params[key]))
        return paramsArray.join('&')
    }
}

// todo 清空搜索结果
export function searchRepoByQuery(action$, {getState, dispatch}, {get}) {
    return action$.ofType(Types.SEARCH_REPO)
        .switchMap(action => {
            const {url, query} = action.payload
            const headers = {
                "Authorization": `token ${getState().userSignInfo.auth.token}`
            }
            const params = {
                q: query,
                sort: 'star'
            }
            const apiUrl = url + getParams(params)
            return get(apiUrl, headers)
                .map(res => res.response || res)
                .map(repos => searchRepoResult(repos.items || [])) // 返回正确结果
                .catch(e => {
                    dispatch(resetSearch()) // 重置搜索状态
                    return Observable.of(putError('网络状况不佳，请稍后在试'))
                        .takeUntil(action$.ofType(Types.SEARCH_REPO_RESET))
                })
        })
}