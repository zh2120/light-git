import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, autoRehydrate, purgeStoredState} from 'redux-persist'
import {createEpicMiddleware} from 'redux-observable';
import {AsyncStorage} from 'react-native'
import {createLogger} from 'redux-logger'
import rootReducer from './reducers'
import rootEpic from './epics'
import {put, get, Delete, post, patch} from './utils/api'

const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {get, put, post, patch, delete: Delete}
});

const configureStore = (initialState) => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const middleWares = [epicMiddleware]
    if (window.__DEV__) {
        middleWares.push(createLogger())
    }
    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            applyMiddleware(...middleWares),
            autoRehydrate()
        )
    )

    persistStore(store, {
        storage: AsyncStorage,
        blacklist: ['commons']
    })

    // purgeStoredState({storage: AsyncStorage}, ['reposInfo', 'userInfo', 'userSignInfo']).then((res) => {
    //     console.log(res)
    // })

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

    return store
}

export default configureStore
