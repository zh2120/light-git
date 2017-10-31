import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import {bindActions} from '../../actions/'
import {openToast} from '../../actions/common'
import {fileContent} from '../../actions/repo'

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

        const text = atob(file.content)

        return (
            <ScrollView contentContainerStyle={styles.wrap}>
                <TextInput editable={false} value={text} multiline={true} style={{fontSize: 16}}/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {width:vw, height: vh, padding: 14, backgroundColor: '#fff'},
})

export default connect(state => ({file: state.repoFile.file}), bindActions({fileContent, openToast}))(File)
