import {
    issue,
    errIssue,
    IssueTypes,
} from '../../reducers/issueReducer'
import {putError} from '../../reducers/comReducer'
import {Observable} from 'rxjs/Rx'

export function issueEpic(action$, {getState, dispatch}, {get}) {
    return action$.ofType(IssueTypes.GET_ISSUE)
        .switchMap(action => {
            const {url} = action.payload
            const headers = {"Accept": "application/vnd.github.squirrel-girl-preview"}

            return get(url, headers).map(res => issue(res.response))
                .catch(e => {
                    console.log(e)
                    dispatch(errIssue())
                    return Observable.of(putError('获取问题失败')).takeUntil(action$.ofType(IssueTypes.ERR_ISSUE))
                })
        })
}