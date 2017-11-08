import {userInfo, userSignInfo} from './userReducer';
import searchInfo from './searchReducer'
import comInfo from './comReducer'
import repoInfo from './repoReducer'
import {navReducer} from '../routers'

export default {
    nav: navReducer,
    userInfo,
    userSignInfo,
    searchInfo,
    comInfo,
    repoInfo
}
