import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { openToast, bindActions, reset } from '../../reducers/comReducer'
import { searchRepo } from '../../reducers/searchReducer'
import { userSignAccept } from '../../reducers/userReducer'
import { getStarCount } from '../../reducers/activityReducer'
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import { Icon, } from '../../components';

const underlayColor = 'rgba(100,100,100 ,0.1)';

const Icons = ({ name, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon name={name} size={24}
                  style={{ padding: 10 }}/>
        </TouchableOpacity>
    );
};

export default connect(({ userInfo, userSignInfo }) => ({
    user: userInfo.user,
    auth: userSignInfo.auth,
    signed: userSignInfo.signed
}), bindActions({ searchRepo, userSignAccept, openToast, reset, getStarCount }))(
    class extends PureComponent {
        static navigationOptions = { header: null };

        renderUserInfo = () => {
            const { navigation, user, auth, getStarCount } = this.props;
            let onPress, avatar;

            if (auth && user) {
                avatar = <Image source={{ uri: user.avatar_url }} style={{ width: 24, height: 24, marginRight: 16 }}/>;
                onPress = () => {
                    getStarCount(); // 获取用户星的总数
                    return navigation.navigate('User', { name: user.login })
                };
            } else {
                avatar = <Icon name={'user'} size={24} style={{ padding: 2, marginRight: 16 }}/>;
                onPress = () => navigation.navigate('SignIn')
            }

            return (
                <TouchableHighlight underlayColor={underlayColor} onPress={onPress}>
                    {avatar}
                </TouchableHighlight>
            )
        };

        go = (routeName) => {
            const { navigation, signed } = this.props;
            if (!signed && routeName !== 'Search') {
                return toast('兄弟伙，还是登录一哈嘛')
            } else {
                return navigation.navigate(routeName);
            }
        };

        render() {
            return (
                <View style={styles.wrap}>
                    <View style={styles.header}>
                        <View style={[styles.logoRow, styles.alignCenter]}>
                            <View style={styles.alignCenter}>
                                <Icons name={'github3'} onPress={() => toast('点我是没有用滴😊')}/>
                                <Icons name={'star'} onPress={() => this.go('StarsList')}/>
                                <Icons name={'repo'} onPress={() => this.go('UserProList')}/>
                                <Icons name={'search_white'} onPress={() => this.go('Search')}/>
                            </View>

                            {this.renderUserInfo()}
                        </View>
                    </View>
                </View>
            )
        }
    }
)


const
    styles = StyleSheet.create({
        wrap: {
            flex: 1,
            backgroundColor: 'transparent'
        },
        header: {
            position: 'relative',
            paddingTop: 24,
            justifyContent: 'space-around',
            height: 70,
            backgroundColor: '#333'
        },
        alignCenter: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        logoRow: {
            height: 36,
            justifyContent: 'space-between',
        }
    });


