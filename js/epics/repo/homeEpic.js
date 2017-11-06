import * as Types from '../../actions/types';
import {
    getRepoContent,
    getRepoContentDenied,
    getFile,
    getDir,
    getReadme,
    getFileDenied,
    fileContent
} from '../../actions/repo';
import {putError} from '../../actions/common';
import {Observable} from 'rxjs/Rx'

export function repoContentEpic(action$, {getState, dispatch}, {get}) {
    return action$.ofType(Types.REPO_HOME)
        .switchMap(action => {
            const {fullName, ref} = action.payload
            const auth = getState().userSignInfo.auth
            // const headers = {"Authorization": `token ${auth && auth.token}`}
            const url = '/repos/' + fullName + '/contents' + getParams({ref})

            // return get(url, headers)
            return get(url, null)
                .map(res => res.response || res)
                .map(content => {
                    if (content instanceof Array) {
                        content.sort((pre, next) => {
                            if (pre.type > next.type) {
                                return 1
                            } else if (pre.type === next.type) {
                                return 0
                            }
                            return -1
                        })
                        return getRepoContent(content)
                    }
                }) // 返回正确结果
                .catch(e => {
                    console.log('repoContentEpic', e)
                    if (e.status === 404) {
                        console.log('仓库获取失败')
                    }
                    dispatch(getRepoContentDenied()) // 重置搜索状态
                    return Observable.of(putError('获取仓库内容，失败。网络状况不佳，请稍后在试'))
                        .takeUntil(action$.ofType(Types.REPO_HOME_CONTENTS_DENIED))
                })
        })
}

export function repoFileEpic(action$, {getState, dispatch}, {get}) {
    return action$.ofType(Types.FILE)
        .switchMap(action => {
            const {fullName, path, ref, type} = action.payload
            const auth = getState().userSignInfo.auth
            const headers = {
                // "Authorization": `token ${auth && auth.token}`,
                "Accept": "application/vnd.github.v3.raw+json"
            }
            const url = '/repos/' + fullName + '/contents/' + path + getParams({ref})
            const apiConfig = type === 'dir' ? {} :{responseType: 'text'} // 不是目录，请求文件内容

            // return get(url, headers, apiConfig)
            return get(url, headers, apiConfig)
                .map(res => res.response || res)
                .map(file => {
                    if (file instanceof Array) {
                        file.sort((pre, next) => {
                            if (pre.type > next.type) {
                                return 1
                            } else if (pre.type === next.type) {
                                return 0
                            }
                            return -1
                        })
                        return getDir(file)
                    }
                    if (path === 'README.md') return getReadme(file)
                    return getFile(file)
                }) // 返回正确结果
                .catch(e => {
                    console.log('repoFileEpic', e)
                    let message = '获取文件，失败。网络状况不佳，请稍后在试'
                    if(e.status === 404) {
                        message = '作者有点懒，仓库没有找到README...'
                    }
                    dispatch(getFileDenied()) // 重置搜索状态
                    return Observable.of(putError(message))
                        .takeUntil(action$.ofType(Types.FILE_CONTENT_DENIED))
                })
        })
}
