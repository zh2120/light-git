import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, persistCombineReducers, createMigrate, purgeStoredState} from 'redux-persist'
import {createEpicMiddleware} from 'redux-observable';
import storage from 'redux-persist/lib/storage'
import {AsyncStorage} from 'react-native'
import rootReducer from './reducers'
import rootEpic from './epics'
import {put, get, Delete, post, patch} from './utils/api'

const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {get, put, post, patch, delete: Delete}
});

const reducer = persistCombineReducers({
    key: 'light-git-root',
    storage,
    blacklist: ['commons'],
}, rootReducer)

export default (initialState) => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const middleWares = [epicMiddleware]

    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(
            applyMiddleware(...middleWares)
        )
    )
    const persistor = persistStore(store)


    // purgeStoredState({storage: AsyncStorage}, ['reposInfo']).then((res) => { // 清空指定的存储
    //     console.log(res)
    // })

    // console.log(persistor)
    //
    // persistor.purge()

    return {persistor, store}

    // if (module.hot) {
    //     const acceptCallback = () => {
    //         const nextRootReducer = require('./reducers/index').default
    //         const nextRootEpic = require('./epics/index').default;
    //         store.replaceReducer(nextRootReducer)
    //         epicMiddleware.replaceEpic(nextRootEpic);
    //     }
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept(['./reducers', './epics'])
    //     module.hot.acceptCallback = acceptCallback
    // }
}
