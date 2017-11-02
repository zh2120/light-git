import {combineEpics} from 'redux-observable';

import {userSignInEpic, userInfoEpic, clearUserInfoEpic} from './user/userEpic';
import {searchRepoByQueryEpic} from './search/repoEpic'
import {repoContentEpic, repoFileEpic} from './repo/homeEpic'

export default combineEpics(userSignInEpic, searchRepoByQueryEpic, userInfoEpic,
    clearUserInfoEpic, repoContentEpic, repoFileEpic);