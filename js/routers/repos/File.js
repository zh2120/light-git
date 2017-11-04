import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, ScrollView, TextInput, StyleSheet, WebView} from 'react-native'
import {bindActions} from '../../actions/'
import {openToast} from '../../actions/common'
import {fileContent, getFileDenied} from '../../actions/repo'
import {html} from '../../components'

export default connect(state => ({file: state.repoFile.file}), bindActions({fileContent, openToast, getFileDenied}))(
    class File extends Component {
        static navigationOptions = ({navigation}) => {
            const params = navigation.state.params
            return {
                headerTitle: params && params.path,
                headerBackTitle: null
            }
        }

        constructor(props) {
            super(props)
            this.state = {
                fullName: props.navigation.state.params.fullName || '',
                path: props.navigation.state.params.path || ''
            }
        }

        componentDidMount() {
            const {navigation, fileContent} = this.props

            if (navigation.state.params) {
                const {fullName, path} = navigation.state.params

                fileContent({fullName, path})
            }
        }

        componentWillUnmount() {
            this.props.getFileDenied() // 清除当前文件
        }

        render() {
            const {file} = this.props

            if (isEmpty(file)) return null

            const tmp = "<pre><code>" + file.replace(/\n/g, '<br/>') + "</code></pre>"

            return (
                <View style={styles.wrap}>
                    <WebView scalesPageToFit={true} style={{flex: 1}} source={{html: html(tmp)}}/>
                </View>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {backgroundColor: 'red', flex: 1},
})

