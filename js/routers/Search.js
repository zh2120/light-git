import React, {PureComponent, Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {bindActions} from '../actions'
import {searchRepo, saveHistory} from '../actions/search'


const SearchHeader = connect(() => ({}), bindActions({searchRepo, saveHistory}))(
    class SearchHeader extends Component {
        state = {searchText: ''}

        componentDidMount() {
            console.log('this.props', this.props)
        }

        changeText = (text) => {
            this.setState({searchText: text})
        }

        searchSubmit = (searchText) => {
            const {searchRepo, saveHistory} = this.props

            // saveHistory(searchText)
            return searchRepo(searchText)
        }

        render() {
            const {searchText} = this.state
            const {navigation} = this.props

            return (
                <View style={searchStyles.wrap}>
                    <View style={searchStyles.searchWrap}>
                        <TouchableOpacity
                            onPress={() => this.searchSubmit(searchText)}>
                            <EvilIcons name={'search'} size={24} style={searchStyles.searchIcon}/>
                        </TouchableOpacity>
                        <TextInput
                            value={searchText}
                            placeholder="Search Github"
                            selectionColor={'#000'}
                            autoCapitalize="none"
                            onChangeText={this.changeText}
                            style={searchStyles.textInput}
                            underlineColorAndroid={'transparent'}
                            onSubmitEditing={() => this.searchSubmit(searchText)}/>
                        {
                            searchText ? (<TouchableOpacity
                                onPress={() => this.setState({searchText: ''})}>
                                <Ionicons size={20} name={'ios-close-circle-outline'} style={{marginRight: 8}}/>
                            </TouchableOpacity>) : null
                        }

                    </View>
                    <TouchableOpacity
                        style={{width: 54, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => navigation.goBack()}>
                        <Text style={{color: '#fff'}}>cancel</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
)


const searchStyles = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        height: 64,
        paddingTop: 24,
        paddingHorizontal: 8,
        alignItems: 'center',
        backgroundColor: 'rgba(30,144,255,0.6)'
    },
    searchWrap: {
        flex: 1,
        height: 30,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    searchIcon: {
        color: '#000',
        marginHorizontal: 5,
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        padding: 0,
        marginHorizontal: 4
    }
})

class Search extends PureComponent {
    static navigationOptions = ({navigation}) => ({header: <SearchHeader navigation={navigation}/>})

    render() {
        const {repos, history} = this.props
        return (
            <View style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 8,}}>
                {
                    history.map((item, index) => {
                        return (
                            <Text key={index}>{item}</Text>
                        )
                    })
                }
            </View>
        )
    }
}

const bindState = state => ({repos: state.reposInfo.repos, history: state.reposInfo.history})

export default connect(bindState)(Search)
