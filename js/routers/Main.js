/**
 * Main.js
 * 首页主要屏幕
 * @author traveller
 * @date create 2017.10.11 23:00:00
 */
import React, {PureComponent} from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import {connect} from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {searchRepo, bindActions} from '../actions'
import {openToast} from '../actions/common'
import {userSignAccept} from '../actions/users'

const UserHead = props => {
    const {signed, user} = props

    const content = (
        <View style={{height: 44, width: 44, justifyContent: 'center', alignItems: 'center'}}>
            {
                user ? <Image source={{uri: user.avatar_url}}
                              style={{
                                  width: 36,
                                  height: 36,
                                  paddingHorizontal: 12
                              }}/> : <EvilIcons name={'user'} size={32}/>
            }
        </View>
    )

    const userOpen = signed ? () => {
        props.navigation.navigate('SignIn')
        // props.navigation.navigate('DrawerOpen')
    } : () => {
        // props.openToast(true)
        // props.navigation.navigate('SignIn')
    }

    return (
        <TouchableWithoutFeedback
            onPress={userOpen}>
            {content}
        </TouchableWithoutFeedback>
    )
}

const bindUserHeadState = state => ({
    signed: state.userSignInfo.signed,
    user: state.userInfo.user
})
const UserState = connect(bindUserHeadState, bindActions({openToast}))(UserHead)

class Main extends PureComponent {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: null,
            headerStyle: {elevation: 0, shadowOpacity: 0, height: ios ? 64 : 44},
            headerLeft: <UserState navigation={navigation}/>
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            searchText: 'react'
        }
    }

    componentDidMount() {
        const {navigation, screenProps} = this.props
        // navigation.setParams({
        //     title: 'efss'
        // })
        console.log(this.props)
        // navigation.navigate('SignIn')
        navigation.navigate('DrawerOpen')

    }

    componentWillReceiveProps(nextProps) {
        const {userSignAccept, auth} = nextProps
        // userSignAccept(auth)
        if (auth) {
            // userSignAccept(auth)
        }
    }

    changeText = (text) => {
        // console.log(text)
        this.setState({searchText: text})
    }

    keyExtractor = (item, index) => item && item.id;

    renderItem = ({item}) => item && (
        <View id={item.id}>
            <Text>{item.name}</Text>
        </View>
    )


    render() {
        const {navigation, searchRepo, repos} = this.props

        const {searchText} = this.state
        return (
            <View style={{flex: 1, backgroundColor: 'transparent'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.searchWrap}>
                        <TextInput
                            value={searchText}
                            placeholder="Search Github"
                            selectionColor={'#000'}
                            autoCapitalize="none"
                            onChangeText={this.changeText}
                            style={styles.textInput}
                            underlineColorAndroid={'transparent'}
                            onSubmitEditing={() => searchRepo(searchText)}/>
                        <TouchableOpacity
                            onPress={() => searchRepo(searchText)}>
                            <EvilIcons name={'search'} size={24} style={styles.searchIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={this.props.repos || []}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchWrap: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginHorizontal: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#888'
    },
    searchIcon: {
        marginRight: 4
    },
    textInput: {
        flex: 1,
        padding: 0,
        margin: 0
    }
})

const bindMainState = state => ({
    repos: state.searchedRepos.repos,
    auth: state.userSignInfo.auth,
})
export default connect(bindMainState, bindActions({searchRepo, userSignAccept}))(Main)