import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {Button} from '../../components'
import {bindActions, reset} from '../../reducers/comReducer'
import {getRepoList, deleteAuth} from '../../reducers/userReducer'

const UserRow = (props) => {
    const {title, text, iconName} = props;
    return (
        <View style={styles.rowWrap}>
            <Feather name={iconName} size={18}/>
            <View style={styles.rowWrap}>
                <Text style={styles.loginText}>{title}</Text>
                <Text style={styles.loginText}>{text}</Text>
            </View>
        </View>
    )
}

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
                nextProps.reset('Home')
            }
        }


        render() {
            const {user} = this.props;
            if (!user) return null;

            const {login, avatar_url, name, email, public_repos, public_gists, followers, following} = user;

            return (
                <ScrollView style={styles.wrap}>
                    <View style={[styles.userBox, {marginTop: 12}]}>
                        <Image source={{uri: avatar_url}} style={styles.avatarBox}/>
                        <View style={styles.userInfoBox}>
                            {name ? <Text style={styles.nameText}>{name}</Text> : null}
                            {login ? <Text style={styles.loginText}>{login}</Text> : null}
                            {email ? <Text style={styles.emailText}>{email}</Text> : null}
                        </View>
                    </View>
                    <View style={{height: 12, backgroundColor: '#ededed',}}/>
                    <View style={{backgroundColor: '#fff', alignItems: 'center'}}>
                        <Button
                            content={<UserRow title={'My repositories'} text={public_repos} iconName={'package'}/>}
                            onPress={() => {
                            }} style={styles.rowBox}/>
                        <Button content={<UserRow title={'My gists'} text={public_gists} iconName={'list'}/>}
                                onPress={() => {
                                }} style={styles.rowBox}/>
                        <Button content={<UserRow title={'Followers'} text={followers} iconName={'users'}/>}
                                onPress={() => {
                                }} style={styles.rowBox}/>
                        <Button content={<UserRow title={'Following'} text={following} iconName={'user-check'}/>}
                                onPress={() => {
                                }} style={styles.rowBox}/>
                    </View>
                </ScrollView>
            )
        }
    }
)

const styles = {
    rowWrap: {
        flex: 1,
        height: 44,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        justifyContent: 'space-between'
    },
    wrap: {
        backgroundColor: '#ededed',
    },
    userBox: {
        paddingHorizontal: 6,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    rowBox: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    avatarBox: {
        width: dp(48),
        height: dp(48),
        margin: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#cdcdcd'
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
        color: '#333',
        fontSize: 14,
    },
    emailText: {
        marginTop: 6
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
};
