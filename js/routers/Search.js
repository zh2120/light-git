import React, {PureComponent, Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const SearchHeader = connect(state => ({}))(
    class SearchHeader extends Component {
        state = {searchText: ''}

        componentDidMount() {
            console.log('this.props', this.props)
        }

        changeText = (text) => {
            this.setState({searchText: text})
        }

        render() {
            const {searchText} = this.state
            const {navigation} = this.props

            return (
                <View style={searchStyles.wrap}>
                    <View style={searchStyles.searchWrap}>
                        <TouchableOpacity
                            onPress={() => {
                            }}>
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
                            onSubmitEditing={() => {
                            }}/>
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
    static navigationOptions = ({navigation}) => {
        return {
            header: <SearchHeader navigation={navigation}/>,
        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 8,}}>
                <Text>sousuo</Text>
            </View>
        )
    }
}

export default Search
