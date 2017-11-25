import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import {Button, Loading} from '../../components/index'
import {bindActions, openToast} from '../../reducers/comReducer'
import {searchRepo} from '../../reducers/searchReducer'

export default connect(({}) => ({}), bindActions({}))(
    class extends Component {
        render() {
            return (
                <View>
                    <Text>用户的仓库项目列表</Text>
                </View>
            )
        }
    }
)