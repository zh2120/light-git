import {combineEpics} from 'redux-observable';

import {searchRepoByQueryEpic} from './search/repoEpic'
import {repoContentEpic, repoFileEpic} from './repo/homeEpic'
import {issueEpic, issueBodyEpic, issueBodyCommentsEpic} from './repo/issueEpic'
import {userSignInEpic, userInfoEpic, clearUserInfoEpic, repoListEpic, checkAuthEpic} from './user/userEpic';

export default combineEpics(
    issueEpic,
    issueBodyEpic,
    repoListEpic,
    checkAuthEpic,
    userInfoEpic,
    repoFileEpic,
    userSignInEpic,
    repoContentEpic,
    clearUserInfoEpic,
    issueBodyCommentsEpic,
    searchRepoByQueryEpic,
);
