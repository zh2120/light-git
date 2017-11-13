import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, persistCombineReducers, createMigrate, purgeStoredState} from 'redux-persist'
import {createEpicMiddleware} from 'redux-observable';
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers'
import rootEpic from './epics'
// import {put, get, Delete, post, patch} from './utils/api'
import api from './utils/api'

const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {get: api.get, put: api.put, post: api.post, patch: api.patch, delete: api.delete}
    // dependencies: {get, put, post, patch, delete: Delete}
});

const reducer = persistCombineReducers({
    key: 'light-git-root',
    storage,
    whitelist: ['userSignInfo', 'userInfo', 'searchInfo', 'repoInfo'],
}, rootReducer)

export default (initialState) => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const middleWares = [epicMiddleware]
    const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...middleWares)))
    const persistor = persistStore(store)

    persistor.purge()

    if (module.hot) {
        const acceptCallback = () => {
            const nextRootEpic = require('./epics/index').default;
            epicMiddleware.replaceEpic(nextRootEpic);
        }

        module.hot.accept('./epics')
        module.hot.acceptCallback = acceptCallback
    }


    return {persistor, store}
}
