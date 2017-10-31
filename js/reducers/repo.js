import * as Types from '../actions/types';

export function repoContent(state = {getting: false, content: []}, action) {
    switch (action.type) {
        case Types.REPO_HOME:
            return {...state, getting: true}

        case Types.REPO_HOME_CONTENTS:
            return {...state, getting: false, content: action.payload.content}

        case Types.REPO_HOME_CONTENTS_DENIED:
            return {...state, getting: false}

        default:
            return state
    }
}

export function repoFile(state = {getting: false, file: {}, readme: {}, dirs: []}, action) {
    switch (action.type) {
        case Types.FILE:  // 请求仓库文件或者目录
            return {...state, getting: true}

        case Types.README:
            return {...state, getting: false, readme: action.payload.file}

        case Types.FILE_CONTENT:  // 存储仓库文件
            return {...state, getting: false, file: action.payload.file}

        case Types.DIR_CONTENT:  // 存储仓库目录
            return {...state, getting: false, dirs: [...state.dirs, action.payload.dirs]}

        case Types.DIR_POP:  // 接受
            return {...state, dirs: [...action.payload.dirs]}

        case Types.FILE_CONTENT_DENIED:  // 获取文件失败，重置到上一个状态
            return {...state, getting: false}

        default:
            return state
    }

}