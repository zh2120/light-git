import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {View, Text, Button, TextInput} from 'react-native'
import {bindActions} from '../reducers/comReducer'

class User extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            password: ''
        }
    }

    componentDidMount() {
    }

    leftText = () => {
        return (
            <Text>
                userName
            </Text>
        )
    }


    render() {
        const {navigation, signInSaveInfo} = this.props
        return (
            <View style={{flex: 1}}>
                <Text>splash</Text>
                <Text>Test</Text>
                <TextInput
                    onChangeText={(account) => this.setState({account})}
                    value={this.state.account}/>
                <TextInput
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry={true}/>
            </View>
        )
    }
}

const mapStateToProps = state => ({...state})

export default connect(mapStateToProps, bindActions({}))(User)