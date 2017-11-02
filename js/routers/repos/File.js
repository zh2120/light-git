import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, ScrollView, TextInput, StyleSheet, WebView} from 'react-native'
import {bindActions} from '../../actions/'
import {openToast} from '../../actions/common'
import {fileContent} from '../../actions/repo'
import {html} from  '../../components'
import marked from 'marked'

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

        // let tmp = marked.parse(file)
        let tmp = "<pre><code>" + file.replace(/\n/g, '<br>') +"</code></pre>"

        return (
            <View style={styles.wrap}>
                <WebView scalesPageToFit={true} style={{width: 400, height: 600}} source={{html: html(tmp)}}/>
            </View>


        )
    }
}

const styles = StyleSheet.create({
    wrap: {backgroundColor: '#fff', flex: 1},
})

export default connect(state => ({file: state.repoFile.file}), bindActions({fileContent, openToast}))(File)
