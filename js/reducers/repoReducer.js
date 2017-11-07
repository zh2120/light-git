import * as Types from '../actions/types';

export function repoContent(state = {getting: false, content: [], file: {}, readme: {}, dirs: []}, action) {
    switch (action.type) {
        case Types.REPO_HOME: // 请求库主内容，文件或者目录
            return {...state, getting: true}

        case Types.REPO_HOME_CONTENTS:
            return {...state, getting: false, content: action.payload.content}

        case Types.REPO_HOME_CONTENTS_DENIED: // 仓库主要内容被清空
            return {...state, getting: false, content: []}

        case Types.FILE:  // 请求仓库的文件
            return {...state, getting: true}

        case Types.README: // 请求仓库的自述文件
            return {...state, getting: false, readme: action.payload.file}

        case Types.FILE_CONTENT:  // 接受存储仓库
            return {...state, getting: false, file: action.payload.file}

        case Types.FILE_CONTENT_DENIED:  // 获取文件失败，
            return {...state, getting: false, file: {}, readme: {}}

        case Types.DIR_CONTENT:  //接受请求 逐级存储仓库目录
            return {...state, getting: false, dirs: [...state.dirs, action.payload.dirs]}

        case Types.CLEAR_DIR:  // 清空库内的子目录所有内容
            return {getting: false, file: {}, readme: {}, dirs: [], content: []}

        case Types.DIR_POP:  // 逐级清空仓库子目录的内容
            return {...state, dirs: [...action.payload.dirs]}

        default:
            return state
    }
}
