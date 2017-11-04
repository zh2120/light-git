import React, {Component} from 'react'
import {connect} from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {searchRepo, bindActions} from '../actions'
import {openToast} from '../actions/common'
import {userSignAccept, exit} from '../actions/users'

import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native'


const underlayColor = 'rgba(100,100,100 ,0.1)';

export default connect(state => ({
    user: state.userInfo.user,
    auth: state.userSignInfo.auth,
    signed: state.userSignInfo.signed
}), bindActions({searchRepo, userSignAccept, openToast}))(
    class extends Component {
        static navigationOptions = {
            header: null
        }

        constructor(props) {
            super(props);
            this.state = {
                searchText: '',
                repos: [],
            };
            this.rotate = new Animated.Value(0)
        }

        componentDidMount() {
            const {navigation} = this.props
            // navigation.navigate('Search')
        }

        changeText = (text) => this.setState({searchText: text})

        // keyExtractor = (item, index) => index;

        renderItem = ({item, index}) => {
            return (
                <View key={index}>
                    <Text>1234</Text>
                </View>
            )
        };

        renderUserInfo = () => {
            const {navigation, user} = this.props;
            let onPress, avatar;
            if (user) {
                avatar = <Image source={{uri: user.avatar_url}} style={{width: 36, height: 36}}/>
                onPress = () => navigation.navigate('SignIn')
            } else {
                onPress = () => navigation.navigate('SignIn')
                avatar = <EvilIcons name={'user'} size={36} style={{color: '#fff', padding: 2}}/>
            }

            return (
                <TouchableHighlight underlayColor={underlayColor} onPress={onPress}>
                    {avatar}
                </TouchableHighlight>
            )
        };

        goSearch = () => { // 传递搜索内容给 Search，
            const {navigation, openToast} = this.props
            this.setState(preState => {
                const searchText = preState.searchText.replace(/^\s+|\s+$/g, ''); // 删除前后的空格
                if (searchText) {
                    navigation.navigate('Search', {searchText})
                } else {
                    openToast('Enter search content！')
                }
                return {searchText: ''}
            })
        };

        render() {
            const {searchText} = this.state;
            const {navigation, signed} = this.props;

            return (
                <View style={styles.wrap}>
                    <View style={styles.header}>
                        <View style={styles.logoRow}>
                            <Text style={styles.logoText}>Github</Text>
                            {
                                this.renderUserInfo()
                            }
                        </View>

                        <View style={styles.searchWrap}>
                            <TextInput
                                value={searchText}
                                placeholder="Search Github"
                                selectionColor={'#000'}
                                autoCapitalize="none"
                                onChangeText={this.changeText}
                                style={styles.textInput}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => this.goSearch()}/>
                            {
                                searchText ? (
                                    <TouchableOpacity
                                        onPress={() => this.setState({searchText: ''})}>
                                        <Ionicons size={20} name={'ios-close-circle-outline'} style={{marginRight: 8}}/>
                                    </TouchableOpacity>
                                ) : null
                            }
                            <TouchableOpacity
                                onPress={() => this.goSearch()}>
                                <EvilIcons name={'search'} size={24} style={styles.searchIcon}/>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.logoRow, {justifyContent: 'space-around',}]}>
                            <TouchableHighlight underlayColor={underlayColor} onPress={() => {
                            }} disabled={!signed}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name={'md-folder-open'} size={24} style={styles.icon}/>
                                    <Text style={styles.icon}>Repos</Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor={underlayColor}
                                                onPress={() => {
                                                }} disabled={!signed}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name={'md-star-outline'} size={24} style={styles.icon}/>
                                    <Text style={styles.icon}>Stars</Text>
                                </View>
                            </TouchableHighlight>


                            <TouchableHighlight underlayColor={underlayColor}
                                                onPress={() => navigation.navigate('Search')} disabled={!signed}>
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
)


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
});


