export const repoTypes = {
    FILE: 'FILE',
    README: 'README',
    DIR_POP: 'DIR_POP',
    CLEAR_DIR: 'CLEAR_DIR',
    REPO_HOME: 'REPO_HOME',
    DIR_CONTENT: 'DIR_CONTENT',
    FILE_CONTENT: 'FILE_CONTENT',
    REPO_HOME_CONTENTS: 'REPO_HOME_CONTENTS',
    FILE_CONTENT_DENIED: 'FILE_CONTENT_DENIED',
    REPO_HOME_CONTENTS_DENIED: 'REPO_HOME_CONTENTS_DENIED'
}

/**
 * 请求仓库内容
 * @param url 仓库地址
 */
export const repoContent = ({fullName = '', ref = 'master'}) => ({
    type: repoTypes.REPO_HOME,
    payload: {fullName, ref}
})

/**
 * 成功获取仓库内容
 * @param repo 数组 Array
 */
export const getRepoContent = (content) => ({type: repoTypes.REPO_HOME_CONTENTS, payload: {content}})

/**
 * 获取仓库内容，被拒绝，重置UI和数据状态
 */
export const getRepoContentDenied = () => ({type: repoTypes.REPO_HOME_CONTENTS_DENIED})

/**
 * 请求文件内容
 * @param fullName 仓库全名
 * @param path 文件路径
 */
export const fileContent = ({fullName = '', path = '', ref = 'master', type = 'file'}) => ({
    type: repoTypes.FILE,
    payload: {fullName, path, ref, type}
})

/**
 * 获得文件详情
 * @param file 文件对象
 */
export const getFile = (file) => ({type: repoTypes.FILE_CONTENT, payload: {file}})

/**
 * 获得Readme
 * @param file 文件对象
 */
export const getReadme = (file) => ({type: repoTypes.README, payload: {file}})

/**
 * 获取文件或者失败，被拒绝
 */
export const getFileDenied = () => ({type: repoTypes.FILE_CONTENT_DENIED})

/**
 * 获取目录
 * @param dirs 目录内容
 */
export const getDir = (dirs) => ({type: repoTypes.DIR_CONTENT, payload: {dirs}})

/**
 *
 * @param dirs 目录栈最后一个元素没删除，返回新的目录栈
 */
export const popDir = (dirs) => ({type: repoTypes.DIR_POP, payload: {dirs}})

export const clearDir = () => ({type: repoTypes.CLEAR_DIR})


export default (state = {getting: false, content: [], file: {}, readme: {}, dirs: []}, action) =>  {
    switch (action.type) {
        case repoTypes.REPO_HOME: // 请求库主内容，文件或者目录
            return {...state, getting: true}

        case repoTypes.REPO_HOME_CONTENTS:
            return {...state, getting: false, content: action.payload.content}

        case repoTypes.REPO_HOME_CONTENTS_DENIED: // 仓库主要内容被清空
            return {...state, getting: false, content: []}

        case repoTypes.FILE:  // 请求仓库的文件
            return {...state, getting: true}

        case repoTypes.README: // 请求仓库的自述文件
            return {...state, getting: false, readme: action.payload.file}

        case repoTypes.FILE_CONTENT:  // 接受存储仓库
            return {...state, getting: false, file: action.payload.file}

        case repoTypes.FILE_CONTENT_DENIED:  // 获取文件失败，
            return {...state, getting: false, file: {}, readme: {}}

        case repoTypes.DIR_CONTENT:  //接受请求 逐级存储仓库目录
            return {...state, getting: false, dirs: [...state.dirs, action.payload.dirs]}

        case repoTypes.CLEAR_DIR:  // 清空库内的子目录所有内容
            return {getting: false, file: {}, readme: {}, dirs: [], content: []}

        case repoTypes.DIR_POP:  // 逐级清空仓库子目录的内容
            return {...state, dirs: [...action.payload.dirs]}

        default:
            return state
    }
}
