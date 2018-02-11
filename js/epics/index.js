import { combineEpics } from 'redux-observable';

import { searchRepoByQueryEpic } from './search/repoEpic'
import { repoContentEpic, repoFileEpic } from './repo/homeEpic'
import { issueEpic, issueBodyEpic, issueBodyCommentsEpic } from './repo/issueEpic'
import { userSignInEpic, userInfoEpic, clearUserInfoEpic, proListEpic, checkAuthEpic } from './user/userEpic';
import { starCountEpic, starsEpic, staringEpic } from './activity/starEpic'
import { eventsEpic} from './activity/eventsEpic'

export default combineEpics(
    issueEpic,
    issueBodyEpic,
    proListEpic,
    checkAuthEpic,
    userInfoEpic,
    repoFileEpic,
    starCountEpic,
    starsEpic,
    userSignInEpic,
    repoContentEpic,
    clearUserInfoEpic,
    issueBodyCommentsEpic,
    searchRepoByQueryEpic,
    staringEpic,
    eventsEpic
);
