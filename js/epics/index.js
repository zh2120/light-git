import {combineEpics} from 'redux-observable';

import searchUsers from './user/searchUsers';
import {userSignInEpic, userInfoEpic, clearUserInfoEpic} from './user/userEpic';
import {searchRepoByQueryEpic} from './search/repoEpic'
import {repoContentEpic, repoFileEpic} from './repo/homeEpic'

export default combineEpics(searchUsers, userSignInEpic, searchRepoByQueryEpic, userInfoEpic,
    clearUserInfoEpic, repoContentEpic, repoFileEpic);