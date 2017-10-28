import {combineEpics} from 'redux-observable';

import searchUsers from './user/searchUsers';
import {userSignInEpic, userInfoEpic, clearUserInfoEpic} from './user/users';
import {searchRepoByQueryEpic} from './search/repo'
import {repoContentEpic} from './repo/repoHome'

export default combineEpics(searchUsers, userSignInEpic, searchRepoByQueryEpic, userInfoEpic,
    clearUserInfoEpic, repoContentEpic);