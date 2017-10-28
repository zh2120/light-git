import {bindActionCreators} from 'redux';

const bindActions = actions => dispatch => ({...bindActionCreators(actions, dispatch)})

import {searchRepo, searchRepoResult, resetSearch} from './search'

export {
    bindActions,
    searchRepo,
    searchRepoResult,
    resetSearch
}
