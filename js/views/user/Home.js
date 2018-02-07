import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {openToast, bindActions, reset} from '../../reducers/comReducer'
import {searchRepo} from '../../reducers/searchReducer'
import {userSignAccept} from '../../reducers/userReducer'
import {getStarCount} from '../../reducers/activityReducer'
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Button,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'
import {CAlert, CLoading, CToast} from '../../components'

const underlayColor = 'rgba(100,100,100 ,0.1)';

export default connect(({userInfo, userSignInfo}) => ({
    user: userInfo.user,
    auth: userSignInfo.auth,
    signed: userSignInfo.signed
}), bindActions({searchRepo, userSignAccept, openToast, reset, getStarCount}))(
    class extends PureComponent {
        static navigationOptions = {header: null};

        state = {
            searchText: ''
        };

        changeText = (text) => this.setState({searchText: text});

        renderUserInfo = () => {
            const {navigation, user, auth, getStarCount} = this.props;
            let onPress, avatar;

            if (auth && user) {
                avatar = <Image source={{uri: user.avatar_url}} style={{width: 36, height: 36}}/>;
                onPress = () => {
                    getStarCount(); // 获取用户星的总数
                    return navigation.navigate('User', {name: user.login})
                };
            } else {
                avatar = <EvilIcons name={'user'} size={36} style={{color: '#ffffff', padding: 2}}/>;
                onPress = () => navigation.navigate('SignIn')
            }

            return (
                <TouchableHighlight underlayColor={underlayColor} onPress={onPress}>
                    {avatar}
                </TouchableHighlight>
            )
        };

        goSearch = () => { // 传递搜索内容给 Search，
            const {navigation, openToast} = this.props;
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

        show = () => {
            CLoading.open('加载')
        }

        close = () => {
            CToast.open('通知')
        }

        render() {
            const {searchText} = this.state;
            const {navigation, signed} = this.props;

            return (
                <View style={styles.wrap}>
                    <View style={styles.header}>
                        <View style={styles.logoRow}>
                            <Text style={styles.logoText}>Github</Text>
                            {this.renderUserInfo()}
                        </View>

                        <TouchableOpacity style={styles.searchWrap} onPress={() => navigation.navigate('Search')}>
                            <TextInput
                                editable={false}
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
                                        disabled={true}
                                        onPress={() => this.setState({searchText: ''})}>
                                        <Ionicons size={20} name={'ios-close-circle-outline'} style={{marginRight: 8}}/>
                                    </TouchableOpacity>
                                ) : null
                            }
                            <TouchableOpacity
                                disabled={true}
                                onPress={() => this.goSearch()}>
                                <EvilIcons name={'search'} size={24} style={styles.searchIcon}/>
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <View style={[styles.logoRow, {justifyContent: 'space-around',}]}>
                            <TouchableHighlight underlayColor={underlayColor} disabled={!signed}
                                                onPress={() => navigation.navigate('StarsList')}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name={'md-star-outline'} size={24} style={styles.icon}/>
                                    <Text style={styles.icon}>Stars</Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor={underlayColor} disabled={!signed}
                                                onPress={() => navigation.navigate('UserProList')}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name={'md-folder-open'} size={24} style={styles.icon}/>
                                    <Text style={styles.icon}>Repos</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <Button title={'加载'} onPress={this.show}/>
                    <Button title={'通知'} onPress={this.close}/>
                    {/*<CLoading />*/}
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
        height: 200,
        backgroundColor: '#333'
    },
    logoRow: {
        height: 36,
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
        color: '#ffffff'
    },
    logoText: {
        fontSize: 24,
        textAlign: 'left',
        color: '#ffffff'
    },
    searchWrap: {
        height: 36,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
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


