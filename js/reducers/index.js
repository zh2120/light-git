import { combineReducers } from 'redux';
import {userInfo, userSignInfo} from './user/users';
import {reposInfo} from './search'
import {commons} from './common'

export default combineReducers({
    userInfo,
    userSignInfo,
    reposInfo,
    commons
})
