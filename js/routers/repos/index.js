import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, WebView} from 'react-native'
import {bindActions} from '../../actions/'
import {repoContent} from '../../actions/repo'

class RepoHome extends Component {

    componentDidMount() {
        const {repoContent, navigation} = this.props
        console.log(navigation)
        if (navigation.state.params) {
            repoContent(navigation.state.params.fullName)
        }
        // repoContent('zh2120/light-git')
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <Text>zhuye</Text>

            </View>
        )
    }
}

export default connect(() => ({}), bindActions({repoContent}))(RepoHome)
