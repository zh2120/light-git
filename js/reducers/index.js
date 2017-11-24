import comInfo, {navReducer} from './comReducer'
import repoInfo from './repoReducer'
import issueInfo from './issueReducer'
import searchInfo from './searchReducer'
import {userInfo, userSignInfo} from './userReducer';
import starInfo from './activityReducer'

export default {
    comInfo,
    repoInfo,
    userInfo,
    issueInfo,
    searchInfo,
    userSignInfo,
    starInfo,
    nav: navReducer
}
