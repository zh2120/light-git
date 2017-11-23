export const RepoTypes = {
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
};

/**
 * 请求仓库内容
 * @param url 仓库地址
 */
export const repoContent = (url) => ({
    type: RepoTypes.REPO_HOME,
    payload: {url}
});

/**
 * 成功获取仓库内容
 * @param content 数组 Array
 */
export const getRepoContent = (content) => ({type: RepoTypes.REPO_HOME_CONTENTS, payload: {content}});

/**
 * 获取仓库内容，被拒绝，重置UI和数据状态，并传递错误信息
 */
// todo 增加错误信息
export const getRepoContentDenied = () => ({type: RepoTypes.REPO_HOME_CONTENTS_DENIED});

/**
 *
 * @param fullName 仓库所属
 * @param path 仓库卢靖
 * @param ref 分支
 * @param type 文件或者目录
 */
export const fileContent = ({fullName = '', path = '', ref = 'master', type = 'file'}) => ({
    type: RepoTypes.FILE,
    payload: {fullName, path, ref, type}
});

/**
 * 获得文件详情
 * @param file 文件对象
 */
export const getFile = (file) => ({type: RepoTypes.FILE_CONTENT, payload: {file}});

/**
 * 获得Readme
 * @param file 文件对象
 */
export const getReadme = (file) => ({type: RepoTypes.README, payload: {file}});

/**
 * 获取文件或者失败，被拒绝
 */
export const getFileDenied = () => ({type: RepoTypes.FILE_CONTENT_DENIED});

/**
 * 获取目录
 * @param dirs 目录内容
 */
export const getDir = (dirs) => ({type: RepoTypes.DIR_CONTENT, payload: {dirs}});

/**
 *
 * @param dirs 目录栈最后一个元素没删除，返回新的目录栈
 */
export const popDir = (dirs) => ({type: RepoTypes.DIR_POP, payload: {dirs}});

export const clearDir = () => ({type: RepoTypes.CLEAR_DIR});

/**
 *
 * @param state
 * {getting: false, content: [], file: {}, readme: '', dirs: []}
 * content 仓库主页的目录和文件列表 file：仓库文件 readme: 自诉文件， dirs: 目录栈
 * @param type
 * @param payload
 * @returns {*}
 */
// todo 文件未加载的 UI 处理， getting 的存在，值得考虑一哈
export default (state = {getting: false, content: null, file: {}, readme: '', dirs: []}, {type, payload}) => {
    switch (type) {
        case RepoTypes.REPO_HOME: // 请求库主内容，文件或者目录
            return {...state, getting: true};

        case RepoTypes.REPO_HOME_CONTENTS:
            return {...state, getting: false, content: payload.content};

        case RepoTypes.REPO_HOME_CONTENTS_DENIED: // 仓库主要内容被清空
            return {...state, getting: false, content: null};

        case RepoTypes.FILE:  // 请求仓库的文件
            return {...state, getting: true};

        case RepoTypes.README: // 请求仓库的自述文件
            return {...state, getting: false, readme: payload.file};

        case RepoTypes.FILE_CONTENT:  // 接受存储仓库
            return {...state, getting: false, file: payload.file};

        case RepoTypes.FILE_CONTENT_DENIED:  // 获取文件失败，
            return {...state, getting: false, file: {}, readme: {}};

        case RepoTypes.DIR_CONTENT:  //接受请求 逐级存储仓库目录
            return {...state, getting: false, dirs: [...state.dirs, payload.dirs]};

        case RepoTypes.CLEAR_DIR:  // 清空库内的子目录所有内容
            return {getting: false, content: null, file: {}, readme: {}, dirs: []};

        case RepoTypes.DIR_POP:  // 逐级清空仓库子目录的内容
            return {...state, dirs: [...payload.dirs]};

        default:
            return state
    }
}
