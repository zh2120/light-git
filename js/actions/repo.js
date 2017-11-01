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
export const getRepoContent = (content) => ({type: Types.REPO_HOME_CONTENTS, payload: {content}})

/**
 * 获取仓库内容，被拒绝，重置UI和数据状态
 */
export const getRepoContentDenied = () => ({type: Types.REPO_HOME_CONTENTS_DENIED})

/**
 * 请求文件内容
 * @param fullName 仓库全名
 * @param path 文件路径
 */
export const fileContent = ({fullName = '', path = '', ref = 'master', type = 'file'}) => ({
    type: Types.FILE,
    payload: {fullName, path, ref, type}
})

/**
 * 获得文件详情
 * @param file 文件对象
 */
export const getFile = (file) => ({type: Types.FILE_CONTENT, payload: {file}})

/**
 * 获得Readme
 * @param file 文件对象
 */
export const getReadme = (file) => ({type: Types.README, payload: {file}})

/**
 * 获取文件或者失败，被拒绝
 */
export const getFileDenied = () => ({type: Types.FILE_CONTENT_DENIED})

/**
 * 获取目录
 * @param dirs 目录内容
 */
export const getDir = (dirs) => ({type: Types.DIR_CONTENT, payload: {dirs}})

/**
 *
 * @param dirs 目录栈最后一个元素没删除，返回新的目录栈
 */
export const popDir = (dirs) => ({type: Types.DIR_POP, payload: {dirs}})