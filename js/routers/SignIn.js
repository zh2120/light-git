import React, {PureComponent} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'
import Octicons from 'react-native-vector-icons/Octicons';
import {Button} from '../components'
import {bindActions} from '../actions'
import {userSignIn, userSignAccept} from '../actions/users'
import {openToast} from '../actions/common'

class SignIn extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'SignIn',
        headerRight: <Button content={<Text>Sign Up</Text>} onPress={() => {
            if (navigation.state.params) {
                return navigation.state.params.goSignUp()
            }
        }}/>
    })

    constructor(props) {
        super(props)

        this.state = {
            account: '',
            password: ''
        }
    }

    componentDidMount() {
        const {setParams, navigate} = this.props.navigation
        setParams({goSignUp: () => navigate('SignUp')})
    }

    componentWillReceiveProps(nextProps) {
        const {signed} = this.props

        // userSignAccept(auth)
        if (signed !== nextProps.signed) {
            this.setState(() => {
                nextProps.navigation.goBack()
                return {
                    account: '',
                    password: ''
                }
            })
        }
    }

    account = (account) => {
        return this.setState({account: String(account)})
    };

    password = (password) => {
        return this.setState({password: String(password)})
    };

    signInSubmit = () => {
        const {account, password} = this.state
        const {userSignIn, openToast} = this.props

        if (account && password) {
            const auth = btoa(`${account}:${password}`)

            userSignIn(auth)
        } else {
            openToast('Check Account or Password')
        }
    };

    render() {
        const {account, password} = this.state
        const {disabled} = this.props

        return (
            <View style={styles.container}>
                <Octicons name={'mark-github'} size={60} style={{marginVertical: 32}}/>
                <TextInput
                    value={account}
                    editable={!disabled}
                    placeholder="UserName or Email"
                    autoCapitalize="none"
                    onChangeText={this.account}
                    style={styles.textInput}
                    underlineColorAndroid={'transparent'}
                    onSubmitEditing={() => {
                    }}/>
                <TextInput
                    value={password}
                    editable={!disabled}
                    secureTextEntry={true}
                    placeholder="password"
                    autoCapitalize="none"
                    onChangeText={this.password}
                    style={styles.textInput}
                    underlineColorAndroid={'transparent'}
                    onSubmitEditing={() => {
                    }}/>
                <Button content={<Text>{disabled ? 'login ...' : 'Authorized Login'}</Text>}
                        style={styles.btnContent} disabled={disabled}
                        onPress={this.signInSubmit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    textInput: {
        width: '80%',
        borderWidth: 0.5,
        borderColor: '#888',
        borderRadius: 2,
        padding: 8,
        marginTop: 30,
    },
    btnContent: {
        width: 200,
        height: 36,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#888',
        marginTop: 28,
    }
})

const bindState = state => ({
    disabled: state.userSignInfo.signInPending,
    signed: state.userSignInfo.signed,
    auth: state.userSignInfo.auth
})

export default connect(bindState, bindActions({userSignIn, openToast, userSignAccept}))(SignIn)
