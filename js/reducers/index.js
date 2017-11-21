import comInfo, {navReducer} from './comReducer'
import repoInfo from './repoReducer'
import issueInfo from './issueReducer'
import searchInfo from './searchReducer'
import {userInfo, userSignInfo} from './userReducer';

export default {
    comInfo,
    repoInfo,
    userInfo,
    issueInfo,
    searchInfo,
    userSignInfo,
    nav: navReducer
}
