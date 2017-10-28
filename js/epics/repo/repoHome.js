import * as Types from '../../actions/types';
import {getRepoContent, getRepoContentDenied} from '../../actions/repo';
import {openToast, putError} from '../../actions/common';
import {Observable} from'rxjs/Rx'

export function repoContentEpic (action$, {getState, dispatch}, {get}) {
    return action$.ofType(Types.REPO_HOME)
        .switchMap(action => {
            const {url} = action.payload
            const auth = getState().userSignInfo.auth

            const headers = {
                "Authorization": `token ${auth && auth.token}`
            }
            console.log('url',url)
            return get(url, headers)
                .map(res => res.response || res)
                .map(content => {
                    console.log('-> repoContent ',content)
                    return getRepoContent(content)
                }) // 返回正确结果
                .catch(e => {
                    dispatch(getRepoContentDenied()) // 重置搜索状态
                    return Observable.of(putError('获取仓库内容，失败。网络状况不佳，请稍后在试'))
                        .takeUntil(action$.ofType(Types.REPO_HOME_CONTENTS_DENIED))
                })
        })
}
