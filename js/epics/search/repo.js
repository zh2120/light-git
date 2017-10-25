import * as Types from '../../actions/types';
import {searchRepoResult} from '../../actions';

const getParams = (params) => {
    if (params) {
        const paramsArray = []
        Object.keys(params).map(key => paramsArray.push(key + '=' + params[key]))
        return paramsArray.join('&')
    }
}

// todo 清空搜索结果
export function searchRepoByQuery(action$, store, {get}) {
    return action$.ofType(Types.SEARCH_REPO)
        .switchMap(action => {
            const {url, query} = action.payload
            const headers = {
                "Content-Type": "application/vnd.github.mercy-preview+json"
            }
            const params = {
                q: query,
                sort: 'updated'
            }
            console.log('----- ',get)
            const apiUrl = url + getParams(params)
            return get(apiUrl)
        })
        .map(res => res.response || res)
        .map(repos => searchRepoResult(repos.items))
        .catch(error => {
            console.log(error)
        })
};