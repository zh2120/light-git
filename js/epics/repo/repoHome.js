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
            const headers = {"Authorization": `token ${auth && auth.token}`}
            const url = '/repos/' + fullName + '/contents' + getParams({ref})

            return get(url, headers)
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

                        dispatch(fileContent({fullName, path: 'README.md'}))
                        return getRepoContent(content)
                    }
                }) // 返回正确结果
                .catch(e => {
                    console.log('repoContentEpic', e)
                    dispatch(getRepoContentDenied()) // 重置搜索状态
                    return Observable.of(putError('获取仓库内容，失败。网络状况不佳，请稍后在试'))
                        .takeUntil(action$.ofType(Types.REPO_HOME_CONTENTS_DENIED))
                })
        })
}

export function repoFileEpic(action$, {getState, dispatch}, {get}) {
    return action$.ofType(Types.FILE)
        .switchMap(action => {
            const {fullName, path, ref} = action.payload
            const auth = getState().userSignInfo.auth
            const headers = {"Authorization": `token ${auth && auth.token}`}
            const url = '/repos/' + fullName + '/contents/' + path + getParams({ref})

            return get(url, headers)
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
                    dispatch(getFileDenied()) // 重置搜索状态
                    return Observable.of(putError('获取文件，失败。网络状况不佳，请稍后在试'))
                        .takeUntil(action$.ofType(Types.FILE_CONTENT_DENIED))
                })
        })
}
