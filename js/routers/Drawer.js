import React, {PureComponent} from 'react'
import {ScrollView, View, Text, StyleSheet, Image} from 'react-native'
import {connect} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather';

import {bindActions} from '../actions/index'
import {deleteAuth, clearUser} from '../actions/users'
import {Button} from '../components/index'
import {MainRouters} from './'

/**
 * 抽屉内部自定义样式
 */
class Drawer extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            routers: null
        }
    }

    componentWillMount() {
        this.setState(preState => ({
            routers: Object.keys(MainRouters).map(item => ({
                screenName: item,
                title: MainRouters[item].title || '',
                icon: MainRouters[item].icon || null
            }))
        }))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userSignInfo && !nextProps.userSignInfo.auth && nextProps.user) {
            nextProps.clearUser()
        }
    }

    exit = () => this.props.deleteAuth()

    render() {
        const {routers} = this.state
        const {user} = this.props
        const routersView = routers.map((item, index) => {
            return (
                <Button content={<Text>{item.title}</Text>}
                        onPress={() => this.props.navigation.navigate(`${item.screenName}`)}
                        key={index}/>
            )
        })

        return (
            <View style={styles.wrap}>

                {
                    user ? (
                        <View style={styles.header}>
                            <Text style={styles.headerText}>{user && user.name}</Text>
                            <Image source={{uri: user && user.avatar_url}} style={styles.avatar}/>
                        </View>
                    ) : (<View style={styles.header}>
                        <Text>未登录</Text>
                    </View>)
                }
                <View style={styles.line}/>
                <View style={styles.content}>
                    <ScrollView>
                        {
                            routersView
                        }
                    </ScrollView>
                </View>
                <View style={styles.line}/>
                {
                    user ? (
                        <View style={styles.footer}>
                            <Button icon={<Feather name={'aperture'} size={16}/>} style={styles.settings}
                                    content={<Text style={styles.settingText}>Settings</Text>}/>

                            <Button icon={<Feather name={'power'} size={16}/>} style={styles.settings}
                                    content={<Text style={styles.settingText}>Sign out</Text>}
                                    onPress={this.exit}/>
                        </View>
                    ) : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingTop: ios ? 20 : 0,
        backgroundColor: 'transparent'
    },
    header: {
        height: 72,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    headerText: {
        marginRight: 14,
        fontSize: 20
    },
    avatar: {
        width: 36,
        height: 36
    },
    content: {
        flex: 1,
        // backgroundColor: 'green'
    },
    line: {
        width: 236,
        marginLeft: 14,
        marginRight: 8,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#aaa'
    },
    footer: {
        height: 50,
        width: '100%',
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settings: {
        height: '100%',
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    settingText: {
        fontSize: 14,
        marginLeft: 8
    }
})

const mapStateToProps = (state) => ({user: state.userInfo.user, userSignInfo: state.userSignInfo})
export default connect(mapStateToProps, bindActions({deleteAuth, clearUser}))(Drawer)
