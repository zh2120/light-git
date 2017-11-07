import {userInfo, userSignInfo} from './userReducer';
import {searchInfo} from './searchReducer'
import {commons} from './comReducer'
import {repoContent} from './repoReducer'
import {navReducer} from '../routers'

export default {
    nav: navReducer,
    userInfo,
    userSignInfo,
    searchInfo,
    commons,
    repoContent
}
