import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, StyleSheet, Image} from 'react-native'
import {bindActions} from '../../reducers/comReducer'
import {getRepoList} from '../../reducers/userReducer'

export default connect(state => ({user: state.userInfo.user}), bindActions({getRepoList}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            const {params} = navigation.state;
            return {
                headerTitle: "github",
                headerTitleStyle: {color: 'rgba(255,255,255,0.8)'},
                headerBackTitleStyle: {color: 'rgba(255,255,255,0.8)'},
                headerStyle: {
                    backgroundColor: '#000'
                }
            }
        };

        constructor(props) {
            super(props);
            this.state = {}
        }

        componentDidMount() {
            this.props.getRepoList({username: ''})
        }


        render() {
            const {login, avatar_url, name, email, public_repos, public_gists, followers, following, location} = this.props.user;

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
