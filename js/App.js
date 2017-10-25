import './utils'
import React from 'react';
import {Provider} from 'react-redux'
import {View, StyleSheet, StatusBar} from 'react-native'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/filter'

import StacksInDrawer from './routers/index'
import configureStore from './configStore'
import {Toast} from './components'

const store = configureStore()

export default props => (
    <Provider store={store}>
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                animated={true}
                backgroundColor="rgba(11, 11, 11, 0.4)"
                barStyle="light-content"/>
            <StacksInDrawer screenProps={{themeColor: 'red'}}/>
            <Toast/>
        </View>
    </Provider>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent'
    }
})
