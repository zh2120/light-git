import {connect} from 'react-redux'
import React, {PureComponent} from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import {Button, Loading} from '../../components'
import {openActionSheet, bindActions, back} from '../../reducers/comReducer'
import {repoContent, clearDir} from '../../reducers/repoReducer'
import {getIssue, getIssueBody, getIssueBodyComments} from '../../reducers/issueReducer'

export default connect(state => ({}), bindActions({getIssueBody, getIssueBodyComments}))(
    class Issues extends PureComponent {
        constructor(props) {
            super()
            const {params} = props.navigation.state;
            this.state = {
                number: params ? params.number : 124,
                fullName: params ? params.fullName : 'crazycodeboy/react-native-splash-screen'
            }
        }

        componentWillMount() {
            console.log(this.props)
            const {fullName, number} = this.state
            const {getIssueBody, getIssueBodyComments} = this.props
            const url = `/repos/${fullName}/issues/${number}/comments`

            if (fullName) getIssueBodyComments(url)
            // if (fullName) getIssueBody(url)
        }

        render() {
            return (
                <View>
                    <Text>sga</Text>
                </View>
            )
        }
    }
)