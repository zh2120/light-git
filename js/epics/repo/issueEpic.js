import {
    issue,
    errIssue,
    IssueTypes,
    issueBody,
    errIssueBody,
    issueBodyComments,
    errIssueComments
} from '../../reducers/issueReducer'
import {putError} from '../../reducers/comReducer'
import {Observable} from 'rxjs/Rx'

export const issueEpic = (action$, {getState, dispatch}, {get}) => action$.ofType(IssueTypes.GET_ISSUE)
    .switchMap(action => {
        const {url} = action.payload
        const headers = {"Accept": "application/vnd.github.squirrel-girl-preview"}

        return get(url, headers).map(res => issue(res.response))
            .catch(e => {
                console.log(e)
                dispatch(errIssue())
                return Observable.of(putError('获取问题失败')).takeUntil(action$.ofType(IssueTypes.ERR_ISSUE))
            })
    });


export const issueBodyEpic = (action$, {getState, dispatch}, {get}) =>
    action$.ofType(IssueTypes.GET_ISSUE_BODY, IssueTypes.GET_ISSUE_BODY_COMMENTS)
        .switchMap(action => {
            const {url} = action.payload
            const headers = {"Accept": "application/vnd.github.VERSION.raw+json"}
            let request, err, type
            if (action.type === IssueTypes.GET_ISSUE_BODY) {
                request = issueBody
                err = errIssueBody
                type = IssueTypes.ERR_ISSUE_BODY
            } else {
                request = issueBodyComments
                err = errIssueComments
                type = IssueTypes.ERR_ISSUE_COMMENTS
            }
            return get(url, headers).map(res => request(res.response))
                .catch(e => {
                    console.log(e)
                    dispatch(err())
                    return Observable.of(putError('获取问题详情失败'))
                        .takeUntil(action$.ofType(type))
                })
        });