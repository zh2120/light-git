import React, {Component} from 'react'
import {connect} from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {searchRepo, bindActions} from '../actions'
import {openToast} from '../actions/common'
import {userSignAccept} from '../actions/users'
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native'

const underlayColor = 'rgba(100,100,100 ,0.1)'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            repos: [],
        }
    }

    componentDidMount() {
        const {navigation} = this.props
        navigation.navigate('Search')
    }

    changeText = (text) => {
        this.setState({searchText: text})
    }

    // keyExtractor = (item, index) => index;

    renderItem = ({item, index}) => {
        return (
            <View key={index}>
                <Text>1234</Text>
            </View>
        )
    }

    renderUserInfo = () => {
        const {navigation, user} = this.props
        let onPress, avatar, name
        if (user) {
            // todo 弹出用户信息
            name = user.name
            avatar = <Image source={{uri: user.avatar_url}} style={{width: 36, height: 36}}/>
            onPress = () => navigation.navigate('SignIn')
        } else {
            name = ''
            // onPress = () => navigation.navigate('SignIn')
            avatar = <EvilIcons name={'user'} size={36} style={{color: '#fff', padding: 2}}/>
        }

        return (
            <TouchableHighlight underlayColor={underlayColor} onPress={onPress}>
                {avatar}
            </TouchableHighlight>
        )
    }

    goSearch = () => {
        const {navigation} = this.props
        return navigation.navigate('Search')
    }

    render() {
        const {searchText} = this.state
        return (
            <View style={styles.wrap}>
                <View style={styles.header}>
                    <View style={styles.logoRow}>
                        <Text style={styles.logoText}>Github</Text>
                        {
                            this.renderUserInfo()
                        }
                    </View>
                    <TouchableWithoutFeedback onPress={this.goSearch}>
                        <View style={styles.searchWrap}>
                            <TextInput
                                editable={false}
                                value={searchText}
                                placeholder="Search Github"
                                selectionColor={'#000'}
                                autoCapitalize="none"
                                onChangeText={this.changeText}
                                style={styles.textInput}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => searchRepo(searchText)}/>
                            <TouchableOpacity
                                disabled={true}
                                onPress={() => searchRepo(searchText)}>
                                <EvilIcons name={'search'} size={24} style={styles.searchIcon}/>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.logoRow, {justifyContent: 'space-around',}]}>
                        <TouchableHighlight underlayColor={underlayColor} onPress={() => {
                        }}>
                            <View style={styles.iconWrap}>
                                <Ionicons name={'md-folder-open'} size={24} style={styles.icon}/>
                                <Text style={styles.icon}>Repos</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor={underlayColor} onPress={() => {
                        }}>
                            <View style={styles.iconWrap}>
                                <Ionicons name={'md-star-outline'} size={24} style={styles.icon}/>
                                <Text style={styles.icon}>Stars</Text>
                            </View>
                        </TouchableHighlight>


                        <TouchableHighlight underlayColor={underlayColor} onPress={() => {
                        }}>
                            <View style={styles.iconWrap}>
                                <Ionicons name={'md-bulb'} size={24} style={styles.icon}/>
                                <Text style={styles.icon}>Gists</Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    header: {
        position: 'relative',
        paddingTop: 24,
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        height: 240,
        backgroundColor: 'rgba(30,144,255,0.6)'
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconWrap: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginTop: 4,
        color: '#fff'
    },
    logoText: {
        fontSize: 24,
        textAlign: 'left',
        color: '#fff'
    },
    searchWrap: {
        height: 36,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    searchIcon: {
        marginHorizontal: 6, alignItems: 'center'
    },
    textInput: {
        flex: 1,
        padding: 0,
        marginHorizontal: 6
    }
})

const bindMainState = state => ({
    user: state.userInfo.user,
})
export default connect(bindMainState, bindActions({searchRepo, userSignAccept}))(Home)
