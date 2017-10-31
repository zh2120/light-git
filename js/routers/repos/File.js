import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, WebView, FlatList, StyleSheet, TouchableOpacity} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import {Button} from '../../components'
import {bindActions} from '../../actions/'
import {openToast} from '../../actions/common'
import {repoContent} from '../../actions/repo'

class File extends Component {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        return {
            headerTitle: params && params.name,
            headerBackTitle: null
        }
    }

    componentDidMount() {
        const {repoContent, navigation} = this.props
        // console.log(navigation)
        if (navigation.state.params) {
            // repoContent(navigation.state.params.fullName)
        }
        // repoContent({fullName: 'zh2120/light-git'})
    }

    componentWillUnmount() {
    }

    render() {
        const {content} = this.props

        return (
            <WebView style={styles.wrap}/>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {flex: 1, backgroundColor: '#fff'},
})

export default connect(state => ({content: state.repoContent.content}), bindActions({repoContent, openToast}))(File)
