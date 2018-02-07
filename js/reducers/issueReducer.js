export const IssueTypes = {
    ISSUE: 'ISSUE',
    GET_ISSUE: 'GET_ISSUE',
    ERR_ISSUE: 'ERR_ISSUE',
    GET_ISSUE_BODY: 'GET_ISSUE_BODY',
    ISSUE_BODY: 'ISSUE_BODY',
    ERR_ISSUE_BODY: 'ERR_ISSUE_BODY',
    GET_ISSUE_BODY_COMMENTS: 'GET_ISSUE_BODY_COMMENTS',
    ISSUE_BODY_COMMENTS: 'ISSUE_BODY_COMMENTS',
    ERR_ISSUE_COMMENTS: 'ERR_ISSUE_COMMENTS'
};

/**
 * 获取问题
 * @param url 指定仓库的问题url
 */
export const getIssue = (url) => ({ type: IssueTypes.GET_ISSUE, payload: { url } });

export const issue = (data) => ({ type: IssueTypes.ISSUE, payload: { data } });

export const errIssue = () => ({ type: IssueTypes.ERR_ISSUE });

export const getIssueBody = (url) => ({ type: IssueTypes.GET_ISSUE_BODY, payload: { url } });

export const issueBody = (body) => ({ type: IssueTypes.ISSUE_BODY, payload: { body } });

export const errIssueBody = () => ({ type: IssueTypes.ERR_ISSUE_BODY });

export const getIssueBodyComments = (url) => ({ type: IssueTypes.GET_ISSUE_BODY_COMMENTS, payload: { url } });

export const issueBodyComments = (comments) => ({ type: IssueTypes.ISSUE_BODY_COMMENTS, payload: { comments } });

/**
 * 清空评论内容，当作出错处理
 */
export const errIssueComments = () => ({ type: IssueTypes.ERR_ISSUE_COMMENTS });

export default (state = { getting: false, issues: null, issueBody: null, issueComments: null }, { type, payload }) => {
    switch (type) {
        case IssueTypes.GET_ISSUE:
            return { ...state, getting: true };

        case IssueTypes.ISSUE:
            if (state.issues) { // get more
                return { ...state, issues: [ ...state.issues, ...payload.data ], getting: false }
            }
            return { ...state, issues: [ ...payload.data ], getting: false };

        case IssueTypes.ERR_ISSUE:
            return { ...state, issues: null, getting: false };

        case IssueTypes.ISSUE_BODY:
            return { ...state, issueBody: payload.body };

        case IssueTypes.ERR_ISSUE_BODY:
            return { ...state, issueBody: null };

        case IssueTypes.ISSUE_BODY_COMMENTS:
            return { ...state, issueComments: payload.comments };

        case IssueTypes.ERR_ISSUE_COMMENTS:
            return { ...state, issueComments: null, issueBody: null };

        default:
            return state
    }
}
