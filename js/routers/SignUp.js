import React, {Component} from 'react'
import {
    WebView,
    ActivityIndicator
} from 'react-native'

export default class SignUp extends Component {
    static navigationOptions = {
        headerTitle: 'Sign Up'
    }

    render() {
        return (
            <WebView style={{flex: 1}} scalesPageToFit={true}
                     onError={() => alert('加载失败')}
                     renderLoading={() => <ActivityIndicator size={'large'}/>}
                     source={{uri: 'https://github.com/join'}}/>
        )
    }
}