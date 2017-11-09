export const IssueTypes = {
    ISSUE: 'ISSUE',
    GET_ISSUE: 'GET_ISSUE',
    ERR_ISSUE: 'ERR_ISSUE',
}

/**
 * 获取问题
 * @param url 指定仓库的问题url
 */
export const getIssue = (url) => ({type: IssueTypes.GET_ISSUE, payload: {url}})

export const issue = (data) => ({type: IssueTypes.ISSUE, payload: {data}})

export const errIssue = () => ({type: IssueTypes.ERR_ISSUE})


export default (state = {getting: false, issues: []}, action) => {
    switch (action.type) {
        case IssueTypes.GET_ISSUE:
            return {...state, getting: true}

        case IssueTypes.ISSUE:
            return {...state, issues: [...state.issues, ...action.payload.data], getting: false}

        case IssueTypes.ERR_ISSUE:
            return {...state, issues: [], getting: false}
        default:
            return state
    }
}
