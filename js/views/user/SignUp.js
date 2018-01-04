import React, {Component} from 'react'
import {
    WebView,
    ActivityIndicator
} from 'react-native'

export default class SignUp extends Component {
    static navigationOptions = {
        headerTitle: 'Sign Up'
    };

    render() {
        return (
            <WebView
                style={{maxWidth: vw}}
                automaticallyAdjustContentInsets={false}
                userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'}
                onError={() => alert('加载失败')}
                renderLoading={() => <ActivityIndicator size={'large'}/>}
                source={{uri: 'https://github.com/join'}}/>
        )
    }
}