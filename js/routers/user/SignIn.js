import React, {PureComponent} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'
import Octicons from 'react-native-vector-icons/Octicons';
import {Button} from '../../components/'
import {userSignIn, userSignAccept} from '../../reducers/userReducer'
import {openToast, bindActions, reset, openModal} from '../../reducers/comReducer'

export default connect(state => ({
    auth: state.userSignInfo.auth,
    signed: state.userSignInfo.signed,
    disabled: state.userSignInfo.signInPending
}), bindActions({userSignIn, openToast, userSignAccept, reset, openModal}))(
    class extends PureComponent {
        static navigationOptions = ({navigation}) => ({
            headerTitle: 'SignIn',
            headerRight: <Button content={<Text>Sign Up</Text>} onPress={() => {
                if (navigation.state.params) {
                    return navigation.state.params.goSignUp()
                }
            }}/>
        });

        constructor(props) {
            super(props);

            this.state = {
                account: '',
                password: ''
            }
        }

        componentWillMount() {

        }


        componentDidMount() {
            const {navigation} = this.props;
            //  setParams
            navigation.setParams({goSignUp: () => navigation.navigate('SignUp')})
        }

        componentWillReceiveProps(nextProps) {
            const {auth} = this.props;
            if (!auth && nextProps.auth && nextProps.signed) {
                this.setState(() => {
                    nextProps.reset('Home');
                    return {account: '', password: ''}
                })
            }
        }

        account = (account) => this.setState({account: String(account)});

        password = (password) => this.setState({password: String(password)});

        signInSubmit = () => {
            const {account, password} = this.state;
            const {userSignIn, openToast, openModal} = this.props;
            // openModal()
            // todo 账号过滤空格，回车等
            if (account && password) {
                const auth = btoa(`${account}:${password}`);

                userSignIn(auth)
            } else {
                openToast('Check Account or Password')
            }
        };

        render() {
            const {account, password} = this.state;
            const {disabled} = this.props;
            // todo 键盘遮掩
            // todo 如果登录中，延迟过高，中途用户退出，登录状态还没有重置，再次打开App 无法登录，需要遮掩层，无法操作
            return (
                <View style={styles.container}>
                    <Octicons name={'mark-github'} size={60} style={{marginVertical: 32}}/>
                    <TextInput
                        value={account}
                        placeholder="UserName or Email"
                        autoCapitalize="none"
                        onChangeText={this.account}
                        style={styles.textInput}
                        underlineColorAndroid={'transparent'}
                        onSubmitEditing={() => {
                        }}/>
                    <TextInput
                        value={password}
                        secureTextEntry={true}
                        placeholder="password"
                        autoCapitalize="none"
                        onChangeText={this.password}
                        style={styles.textInput}
                        underlineColorAndroid={'transparent'}
                        onSubmitEditing={() => {
                        }}/>
                    <Button content={<Text>{disabled ? 'login ...' : 'Authorized Login'}</Text>}
                            style={styles.btnContent}
                            onPress={this.signInSubmit}/>
                </View>
            )
        }
    }
)

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


