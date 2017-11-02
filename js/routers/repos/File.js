import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, ScrollView, TextInput, StyleSheet, WebView} from 'react-native'
import {bindActions} from '../../actions/'
import {openToast} from '../../actions/common'
import {fileContent} from '../../actions/repo'
import {html} from  '../../components'

class File extends Component {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        return {
            headerTitle: params && params.path,
            headerBackTitle: null
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
    }

    render() {
        const {file} = this.props

        if (isEmpty(file)) return null

        const tmp = "<pre><code>" + file.replace(/\n/g, '<br/>') +"</code></pre>"

        return (
            <View style={styles.wrap}>
                <WebView scalesPageToFit={true} style={{flex: 1}} source={{html: html(tmp)}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {backgroundColor: 'red', flex: 1},
})

export default connect(state => ({file: state.repoFile.file}), bindActions({fileContent, openToast}))(File)
