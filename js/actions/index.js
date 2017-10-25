import {bindActionCreators} from 'redux';

const bindActions = actions => dispatch => ({...bindActionCreators(actions, dispatch)})

import {searchRepo, searchRepoResult} from './search'

export {
    bindActions,
    searchRepo,
    searchRepoResult,
}
