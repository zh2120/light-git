import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Text, ScrollView, StyleSheet, WebView} from 'react-native'
import {Loading} from '../../components'
import {bindActions} from '../../reducers/comReducer'
import {fileContent, getFileDenied} from '../../reducers/repoReducer'

export default connect(({repoInfo}) => ({file: repoInfo.file}), bindActions({
    fileContent,
    getFileDenied
}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            const params = navigation.state.params;
            return {
                headerTitle: params && params.path,
                headerBackTitle: null
            }
        };

        constructor(props) {
            super(props);
            this.state = {
                fullName: props.navigation.state.params.fullName || '',
                path: props.navigation.state.params.path || ''
            }
        }

        componentDidMount() {
            const {navigation, fileContent} = this.props;
            // console.log('componentDidMount')

            if (navigation.state.params) {
                const {fullName, path} = navigation.state.params;

                fileContent({fullName, path})
            }
        }

        componentWillUnmount() {
            this.props.getFileDenied() // 清除当前文件
        }

        postMessage = (code) => {
            if (this.web) {
                // console.log('postMessage', code)
                this.web.postMessage(JSON.stringify({cmd: 'code', code}))
            }
        };

        render() {
            const {file} = this.props;

            // console.log('render')
            if (isEmpty(file)) return <Loading/>;
            const source = ios ? require('../../editor/index.html') : {
                html: this.props.html,
                baseUrl: 'file:///android_asset/web/'
            };
            return (
                <WebView
                    onLoad={() => this.postMessage(file)}
                    style={{flex: 1}}
                    ref={web => this.web = web}
                    source={source}
                />
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {padding: 8},
    fileText: {fontSize: 14, fontFamily: 'Arial', lineHeight: 22, color: '#333'}
});

