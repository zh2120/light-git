import {
    getFile,
    getDir,
    getReadme,
    RepoTypes,
    getFileDenied,
    getRepoContent,
    getRepoContentDenied,
} from '../../reducers/repoReducer';
import {putError} from '../../reducers/comReducer';
import {Observable} from 'rxjs/Rx'

export function repoContentEpic(action$, {getState, dispatch}, {get}) { // 请求主仓库目录内容
    return action$.ofType(RepoTypes.REPO_HOME)
        .switchMap(action => {
            const {url} = action.payload
            const auth = getState().userSignInfo.auth
            // const headers = {"Authorization": `token ${auth && auth.token}`}
            return get(url)
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
                        .takeUntil(action$.ofType(RepoTypes.REPO_HOME_CONTENTS_DENIED))
                })
        })
}

export function repoFileEpic(action$, {getState, dispatch}, {get}) {
    return action$.ofType(RepoTypes.FILE)
        .switchMap(action => {
            const {fullName, path, ref, type} = action.payload
            const headers = {
                // "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3.raw"
            }
            const url = '/repos/' + fullName + '/contents/' + path + getParams({ref})
            const apiConfig = type === 'dir' ? {} : {"responseType": "text"} // 不是目录，请求文件内容
            // todo 某些文件只有json格式
            return get(url, headers, apiConfig)
                .map(res => {
                    console.log(res)
                    return res.response || res
                })
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
                    if (e.status === 404) {
                        message = '作者有点懒，仓库没有找到README...'
                    }
                    dispatch(getFileDenied()) // 重置搜索状态
                    return Observable.of(putError(message))
                        .takeUntil(action$.ofType(RepoTypes.FILE_CONTENT_DENIED))
                })
        })
}
