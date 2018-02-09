import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { Button, CAlert, Icon } from '../../components'
import { bindActions, reset } from '../../reducers/comReducer'
import { deleteAuth } from '../../reducers/userReducer'

const UserRow = ({ title, text, iconName }) =>(
    <View style={styles.rowWrap}>
        <Icon name={iconName} size={18}/>
        <View style={styles.rowWrap}>
            <Text style={styles.loginText}>{title}</Text>
            <Text style={styles.loginText}>{text}</Text>
        </View>
    </View>
);

export default connect(({ userInfo, userSignInfo, starInfo }) => ({
    user: userInfo.user,
    auth: userSignInfo.auth,
    count: starInfo.count,
}), bindActions({
    reset,
    deleteAuth,
}))(
    class extends Component {
        static navigationOptions = ({ navigation }) => {
            const { params } = navigation.state;
            return {
                headerTitle: "github",
                headerTitleStyle: { color: 'rgba(255,255,255,0.8)' },
                headerBackTitleStyle: { color: 'rgba(255,255,255,0.8)' },
                headerStyle: { backgroundColor: '#333' },
                headerRight: <Button content={<Text style={{ color: '#ffffff' }}>sign out</Text>}
                                     onPress={() => params && params.signOut()}
                                     style={{ height: 40, paddingHorizontal: 12 }}/>
            }
        };

        componentDidMount() {
            const { navigation, auth } = this.props;
            if (auth) {
                navigation.setParams({ signOut: this.signOut })
            }
        }

        shouldComponentUpdate(nextProps) {
            const { auth } = this.props;

            // 前一次auth存在，下一次不存在，则退出
            if (auth && !nextProps.auth) {
                nextProps.reset('Home');
            }
            return true;
        }

        signOut = () => {
            const { deleteAuth, auth } = this.props;
            CAlert.open('注销当前账号', '注销后，每个小时将会请求次数限制到60', [
                {
                    text: '确认',
                    onPress: () => deleteAuth(auth.id)
                },
                { text: '取消' }
            ])
        };

        render() {
            const { user, count, navigation } = this.props;
            if (!user) return null;

            const { login, avatar_url, name, email, public_repos, public_gists, followers, following } = user;

            return (
                <ScrollView style={styles.wrap}>
                    <View style={[styles.userBox, { marginTop: 12 }]}>
                        <Image source={{ uri: avatar_url }} style={styles.avatarBox}/>
                        <View style={styles.userInfoBox}>
                            {name ? <Text style={styles.nameText}>{name}</Text> : null}
                            {login ? <Text style={styles.loginText}>{login}</Text> : null}
                            {email ? <Text style={styles.emailText}>{email}</Text> : null}
                        </View>
                    </View>
                    <View style={{ height: 12, backgroundColor: '#ededed', }}/>
                    <View style={{ backgroundColor: '#ffffff', alignItems: 'center' }}>
                        <Button
                            content={<UserRow title={'Repositories'} text={public_repos} iconName={'package'}/>}
                            onPress={() => navigation.navigate('UserProList')} style={styles.rowBox}/>
                        <Button content={<UserRow title={'Stared'} text={count} iconName={'star'}/>}
                                onPress={() => navigation.navigate('StarsList')} style={styles.rowBox}/>
                        <Button content={<UserRow title={'My gists'} text={public_gists} iconName={'list'}/>}
                                onPress={() => {
                                }} style={styles.rowBox}/>
                        <Button content={<UserRow title={'Followers'} text={followers} iconName={'users'}/>}
                                onPress={() => {
                                }} style={styles.rowBox}/>
                        <Button content={<UserRow title={'Following'} text={following} iconName={'follower'}/>}
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
        backgroundColor: '#ffffff',
    },
    rowBox: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
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
        backgroundColor: '#ffffff'
    }
};
