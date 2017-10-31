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
import {PersistGate} from 'redux-persist/es/integration/react'

import StacksInDrawer from './routers/index'
import configureStore from './configStore'
import {Toast} from './components'

const {persistor, store} = configureStore()

const Loading = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'red'}}>恢复现场中...</Text></View>)

// const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

export default props => (

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
                <Toast/>
            </View>
        </PersistGate>
    </Provider>
)

// export default codePush(codePushOptions)()

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent'
    }
})
