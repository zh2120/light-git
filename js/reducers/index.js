import comInfo from './comReducer'
import repoInfo from './repoReducer'
import issueInfo from './issueReducer'
import searchInfo from './searchReducer'
import { userInfo, userSignInfo } from './userReducer';
import starInfo from './activityReducer'
import { navReducer } from '../views'
import eventsInfo from './events'

export default {
    nav: navReducer,
    comInfo,
    repoInfo,
    userInfo,
    issueInfo,
    searchInfo,
    userSignInfo,
    starInfo,
    eventsInfo
}
