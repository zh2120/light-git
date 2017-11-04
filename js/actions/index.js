import {bindActionCreators} from 'redux';

const bindActions = actions => dispatch => ({...bindActionCreators(actions, dispatch)})

const back = (routeName) => ({type: 'Navigation/BACK', routeName})

import {searchRepo, searchRepoResult, resetSearch} from './search'

export {
    bindActions,
    back,
    searchRepo,
    searchRepoResult,
    resetSearch
}
