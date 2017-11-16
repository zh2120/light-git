import {
    issue,
    errIssue,
    IssueTypes,
    issueBody,
    errIssueBody,
    getIssueBodyComments,
    issueBodyComments,
    errIssueComments
} from '../../reducers/issueReducer'
import {putError} from '../../reducers/comReducer'
import {Observable} from 'rxjs/Rx'

export const issueEpic = (action$, {getState, dispatch}, {get}) => action$.ofType(IssueTypes.GET_ISSUE)
    .switchMap(action => {
        const {url} = action.payload;
        const headers = {"Accept": "application/vnd.github.squirrel-girl-preview"};

        return get(url, headers).map(res => issue(res.response))
            .catch(e => Observable.of(putError('获取问题失败')).startWith(dispatch(errIssue())))
    });


export const issueBodyEpic = (action$, {getState, dispatch}, {get}) =>
    action$.ofType(IssueTypes.GET_ISSUE_BODY)
        .switchMap(action => {
            const {url} = action.payload;
            const headers = {
                "Accept": "application/vnd.github.v3.raw+json",
                "Authorization": `Basic OTMxOTkyMTIwQHFxLmNvbTpnaXRodWJAMTIz`
            };

            return get(url, headers).map(res => issueBody(res.response))
                .startWith(getIssueBodyComments(url + '/comments'))
                .catch(e => Observable.of(putError('获取问题主体失败').startWith(errIssueBody())))
        });

export const issueBodyCommentsEpic = (action$, {getState, dispatch}, {get}) =>
    action$.ofType(IssueTypes.GET_ISSUE_BODY_COMMENTS)
        .switchMap(action => {
            const {url} = action.payload;
            const headers = {
                "Accept": "application/vnd.github.v3.raw+json",
                "Authorization": `Basic OTMxOTkyMTIwQHFxLmNvbTpnaXRodWJAMTIz`
            };

            return get(url, headers).map(res => issueBodyComments(res.response))
                .catch(e => Observable.of(putError('获取问题评论失败').startWith(errIssueComments())))
        });