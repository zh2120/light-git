import React, {PureComponent} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'
import Octicons from 'react-native-vector-icons/Octicons';
import {Button, CAlert} from '../../components/'
import {userSignIn, userSignAccept} from '../../reducers/userReducer'
import {openToast, bindActions, reset, openModal} from '../../reducers/comReducer'

export default connect(({userSignInfo}) => ({auth: userSignInfo.auth}), bindActions({
    userSignIn,
    openToast,
    userSignAccept,
    reset,
    openModal
}))(
    class extends PureComponent {
        static navigationOptions = ({navigation}) => ({
            headerTitle: 'SignIn',
            headerRight: <Button content={<Text style={{color: '#fff'}}>Sign Up</Text>}
                                 onPress={() => navigation.state.params && navigation.state.params.goSignUp()}
                                 style={{height: 40, paddingHorizontal: 12}}/>
        });

        constructor(props) {
            super(props);

            this.state = {
                account: '',
                password: ''
            }
        }

        componentDidMount() {
            const {navigation} = this.props;
            //  setParams
            navigation.setParams({goSignUp: () => navigation.navigate('SignUp')})
        }

        componentWillReceiveProps(nextProps) {
            const {auth} = this.props;
            if (!auth && nextProps.auth) {
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
            // todo 账号过滤空格，回车等
            if (account && password) {
                const auth = btoa(`${account}:${password}`);
                // 打开遮掩层
                openModal(<CAlert title={'In obtaining authorization！'}/>);
                return userSignIn(auth)
            }
            return openToast('Check Account or Password')
        };

        render() {
            const {account, password} = this.state;
            // 键盘遮掩
            // 如果登录中，延迟过高，中途用户退出，登录状态还没有重置，再次打开App 无法登录，需要遮掩层，无法操作
            return (
                <View style={styles.container}>
                    <Octicons name={'mark-github'} size={60} style={{marginBottom: 24}}/>
                    <TextInput
                        value={account}
                        placeholder="UserName or Email"
                        autoCapitalize="none"
                        onChangeText={this.account}
                        selectionColor={'#333'}
                        style={styles.textInput}
                        underlineColorAndroid={'transparent'}/>
                    <TextInput
                        value={password}
                        selectionColor={'#333'}
                        secureTextEntry={true}
                        placeholder="password"
                        autoCapitalize="none"
                        onChangeText={this.password}
                        style={styles.textInput}
                        underlineColorAndroid={'transparent'}
                        onSubmitEditing={this.signInSubmit}/>
                    <Button content={<Text>Authorized Login</Text>}
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
        justifyContent: 'center',
        marginTop: -54
    },
    textInput: {
        textAlign: 'center',
        width: 320,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#888',
        borderRadius: 2,
        marginTop: 36,
    },
    btnContent: {
        width: 200,
        height: 36,
        marginTop: 24,
        borderRadius: 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#888',
    }
});
