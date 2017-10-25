import { combineReducers } from 'redux';
import {userInfo, userSignInfo} from './user/users';
import {searchedRepos} from './search'
import {commons} from './common'

export default combineReducers({
    userInfo,
    userSignInfo,
    searchedRepos,
    commons
})
