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

export const repoListEpic = () => {
};

// todo 点击请求,防止抖动
// 请求主仓库目录内容
export const repoContentEpic = (action$, {getState, dispatch}, {get}) => action$.ofType(RepoTypes.REPO_HOME)
    .switchMap(({payload}) => {
        const {url} = payload;
        const auth = getState().userSignInfo.auth;
        const headers = {"Authorization": `token ${auth && auth.token}`};

        return get(url, headers)
            .map(res => res.response || res)
            .map(content => {
                if (content instanceof Array) { // 目录或者文件分类
                    content.sort((pre, next) => {
                        if (pre.type > next.type) { // type dir or file
                            return 1
                        } else if (pre.type === next.type) {
                            return 0
                        }
                        return -1
                    });
                    return getRepoContent(content)
                }
            })
            .catch(e => {
                return Observable.of(putError('获取仓库内容,网络状况不佳，请稍后在试'))
                    .startWith(getRepoContentDenied())
            })
    });

// todo 点击请求,防止抖动
export const repoFileEpic = (action$, {getState, dispatch}, {get}) => action$.ofType(RepoTypes.FILE)
    .switchMap(({payload}) => {
        const {fullName, path, ref, type} = payload;
        const headers = {
            "Accept": "application/vnd.github.v3.raw"
        };
        const url = '/repos/' + fullName + '/contents/' + path + getParams({ref});
        const apiConfig = type === 'dir' ? {} : {"responseType": "text"}; // 不是目录，请求文件内容
        // todo 某些文件只有json格式
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
                    });
                    return getDir(file)
                }
                // todo 自述文件的缺失
                if (path === 'README.md') return getReadme(file);
                return getFile(file)
            }) // 返回正确结果
            .catch(e => {
                console.log('repoFileEpic', e);
                let message = '获取文件，失败。网络状况不佳，请稍后在试';
                if (e.status === 404) {
                    // todo 自述文件的缺失，错误处理
                    message = '作者有点懒，仓库没有找到README...'
                }
                return Observable.of(putError(message))
                    .startWith(getFileDenied())
            })
    });
