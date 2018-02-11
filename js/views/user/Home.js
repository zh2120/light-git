import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openToast, bindActions, reset } from '../../reducers/comReducer'
import { searchRepo } from '../../reducers/searchReducer'
import { userSignAccept } from '../../reducers/userReducer'
import { getStarCount } from '../../reducers/activityReducer'
import { events } from '../../reducers/events'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'
import { Icon, CList } from '../../components';

const underlayColor = 'rgba(100,100,100 ,0.1)';

const Icons = ({ name, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon name={name} size={24}
                  style={{ padding: 10 }}/>
        </TouchableOpacity>
    );
};

export default connect(({ userInfo, userSignInfo, eventsInfo }) => ({
    user: userInfo.user,
    auth: userSignInfo.auth,
    signed: userSignInfo.signed,
    eventsList: eventsInfo.events
}), bindActions({ searchRepo, userSignAccept, openToast, reset, getStarCount, events }))(
    class extends Component {
        static navigationOptions = { header: null };

        componentDidMount() {
            const { user, events } = this.props;
            if (user) {
                events(user.login)
            }
        }

        shouldComponentUpdate(nextProps) {
            const { user } = this.props;
            if (!user && nextProps.user) {
                nextProps.events(user.login)
            }
            return true
        }

        renderUserInfo = () => {
            const { navigation, user, auth, getStarCount } = this.props;
            let onPress, avatar;

            if (auth && user) {
                avatar = <Image source={{ uri: user.avatar_url }} style={{ width: 24, height: 24 }}/>;
                onPress = () => {
                    getStarCount(); // 获取用户星的总数
                    return navigation.navigate('User', { name: user.login })
                };
            } else {
                avatar = <Icon name={'user'} size={24} style={{ padding: 2 }}/>;
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

        eventsItem = ({ item }) => {
            const { actor, repo, payload } = item;
            return (
                <View style={{ backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 10 }}>
                    <View style={styles.alignCenter}>
                        <Image source={{ uri: actor.avatar_url }} style={{ width: 24, height: 24, marginRight: 12 }}/>
                        <Text style={styles.text}>
                            {actor.display_login}
                            <Text style={{ color: '#555' }}>  {payload.action}  </Text>
                            {repo.name}
                        </Text>
                    </View>
                </View>
            )
        };

        renderEvents = () => {
            const { eventsList, signed } = this.props;
            if (!signed) {
                return (
                    <View style={[styles.wrap, { alignItems: 'center', justifyContent: 'center' }]}>
                        <Text>右上角登录，才能看到更多</Text>
                    </View>
                )
            }
            return (
                <CList
                    data={eventsList}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingTop: 10 }}
                    renderItem={this.eventsItem}/>
            )
        };

        render() {
            return (
                <View style={styles.wrap}>
                    <View style={styles.header}>
                        <View style={[styles.logoRow, styles.alignCenter]}>
                            <View style={styles.alignCenter}>
                                <Icons name={'github3'} onPress={() => toast('点我是没有用滴😊')}/>
                                <Icons name={'repo'} onPress={() => this.go('UserProList')}/>
                                <Icons name={'star'} onPress={() => this.go('StarsList')}/>
                                <Icons name={'search_white'} onPress={() => this.go('Search')}/>
                            </View>

                            {this.renderUserInfo()}
                        </View>
                    </View>
                    {this.renderEvents()}
                </View>
            )
        }
    }
)


const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    text: {
        color: '#0366d6',
        fontSize: 16
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
        marginRight: 16,
        justifyContent: 'space-between',
    }
});
