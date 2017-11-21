import './utils'
import React from 'react';
import {Provider} from 'react-redux'
import codePush from "react-native-code-push";
import {View, StyleSheet, StatusBar, Text} from 'react-native'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/reduce'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/startWith'
import {PersistGate} from 'redux-persist/es/integration/react'

import StacksInDrawer from './routers/index'
import configureStore from './configStore'
import {Toast, ActionSheet} from './components'

const {persistor, store} = configureStore();

const Loading = () => (<View style={styles.loadWrap}><Text style={{color: 'red'}}>恢复现场中...</Text></View>)

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_RESUME
};

const App = () => (
    <Provider store={store}>
        <PersistGate
            persistor={persistor}
            loading={<Loading/>}>
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    animated={true}
                    backgroundColor="rgba(11, 11, 11, 0.4)"
                    barStyle="default"/>
                <StacksInDrawer screenProps={{themeColor: 'red'}}/>
                <Toast persistor={persistor}/>
                <ActionSheet/>
            </View>
        </PersistGate>
    </Provider>
);

export default codePush(codePushOptions)(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent'
    },
    loadWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'}
})
