import * as Types from './types';

/**
 * 请求仓库内容
 * @param url 仓库地址
 */
export const repoContent = ({fullName = '', ref = 'master'}) => ({
    type: Types.REPO_HOME,
    payload: {fullName, ref}
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

/**
 * 请求文件内容
 * @param fullName 仓库全名
 * @param path 文件路径
 */
export const fileContent = ({fullName = '', path = '', ref = 'master'}) => ({
    type: Types.FILE,
    payload: {fullName, path, ref}
})

export const getFile = (file) => ({
    type: Types.FILE_CONTENT,
    payload: {file}
})

export const getDir = (dirs) => ({
    type: Type.DIR_CONTENT,
    payload: {dirs}
})

export const getFileDenied = () => ({
    type: Types.FILE_CONTENT_DENIED
})