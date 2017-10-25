import {combineEpics} from 'redux-observable';
import searchUsers from './user/searchUsers';
import {userSignIn, userInfo, clearUserInfo} from './user/users';
import {searchRepoByQuery} from './search/repo'

export default combineEpics(searchUsers, userSignIn, searchRepoByQuery, userInfo, clearUserInfo);