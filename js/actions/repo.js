import * as Types from './types';

/**
 * 请求仓库内容
 * @param url 仓库地址
 */
export const repoContent = (fullName) => ({
    type: Types.REPO_HOME,
    payload: {url: '/repos/' + fullName + '/contents'}
})

/**
 * 成功获取仓库内容
 * @param repo 数组 Array
 */
export const getRepoContent = (content) => ({
    type: Types.REPO_HOME_CONTENTS,
    payload: {content}
})

/**
 * 获取仓库内容，被拒绝，重置UI和数据状态
 */
export const getRepoContentDenied = () => ({
    type: Types.REPO_HOME_CONTENTS_DENIED
})