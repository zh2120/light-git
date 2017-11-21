import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, StyleSheet, Image} from 'react-native'
import {Button} from '../../components'
import {bindActions, reset} from '../../reducers/comReducer'
import {getRepoList, deleteAuth} from '../../reducers/userReducer'

export default connect(state => ({user: state.userInfo.user, auth: state.userSignInfo.auth}), bindActions({
    getRepoList,
    deleteAuth,
    reset
}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            const {params} = navigation.state;
            return {
                headerTitle: "github",
                headerTitleStyle: {color: 'rgba(255,255,255,0.8)'},
                headerBackTitleStyle: {color: 'rgba(255,255,255,0.8)'},
                headerStyle: {
                    backgroundColor: '#000'
                },
                headerRight: <Button content={<Text style={{color: '#fff'}}>sign out</Text>} onPress={() => {
                    if (params) return params.signOut({id: params.id})
                }}/>
            }
        };

        constructor(props) {
            super(props);
            this.state = {}
        }

        componentDidMount() {
            const {navigation, deleteAuth, auth} = this.props;
            if (auth) {
                navigation.setParams({signOut: deleteAuth, id: auth.id})
            }
        }

        componentWillReceiveProps(nextProps) {
            const {auth} = this.props;

            if (auth && !nextProps.auth) { // 前一次auth存在，下一次不存在，则退出
                nextProps.reset('SignIn')
            }
        }


        render() {
            const {user} = this.props;
            if (!user) return null;

            const {login, avatar_url, name, email, public_repos, public_gists, followers, following, location} = user;

            return (
                <View style={styles.wrap}>
                    <View style={styles.userBox}>
                        <Image source={{uri: avatar_url}} style={styles.avatarBox}/>
                        <View style={styles.userInfoBox}>
                            {name ? <Text style={styles.nameText}>{name}</Text> : null}
                            {login ? <Text style={styles.loginText}>{login}</Text> : null}
                            {email ? <Text style={styles.emailText}>{email}</Text> : null}
                        </View>
                    </View>
                    <View style={styles.container}>
                        <Button content={<Text>重置</Text>} onPress={() => this.props.reset('Home')}/>
                    </View>
                </View>
            )
        }
    }
)

const styles = {
    wrap: {
        flex: 1
    },
    userBox: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#fafbfc',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    avatarBox: {
        width: dp(48),
        height: dp(48),
        margin: 10,
    },
    userInfoBox: {
        flex: 1,
        marginLeft: 10
    },
    nameText: {
        fontWeight: '500',
        color: '#333',
        fontSize: 16,
    },
    loginText: {
        color: '#444',
        fontSize: 12,
    },
    emailText: {
        marginTop: 6
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
};
