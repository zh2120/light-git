import React, {Component} from 'react'
import {connect} from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {searchRepo, bindActions} from '../actions'
import {openToast} from '../actions/common'
import {userSignAccept} from '../actions/users'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, FlatList, ScrollView} from 'react-native'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: 'react',
            repos: [1, 2, 3, 4,1,11,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
            headerHeight: new Animated.Value(0)
        }
        this.scrollPos = new Animated.Value(0);
    }

    componentDidMount() {
        // Animated.timing(                            // Animate value over time
        //     this.scrollPos,                      // The value to drive
        //     {
        //         toValue: 1,                             // Animate to final value of 1
        //         duration: 2000
        //     }
        // ).start()
    }

    changeText = (text) => {
        // console.log(text)
        this.setState({searchText: text})
    }

    keyExtractor = (item, index) => index;

    renderItem = ({item, index}) => {
        return (
            <View key={index}>
                <Text>1234</Text>
            </View>
        )
    }

    // scrollSinkY = (e) => {
    //     console.log(e.nativeEvent)
    //     console.log('--> ',this.state.headerHeight)
    //     return Animated.event(
    //         [{nativeEvent: { contentOffset: { y: this.state.headerHeight } }}],
    //         { useNativeDriver: true }
    //     );
    //
    /*
    *
    *
     <ScrollView
                    scrollEventThrottle={16}
                    style={{borderWidth:1}}
                    onScroll={this.scrollSinkY}
                >
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                    <Text>q2e</Text>
                </ScrollView>

    <AnimatedFlatList
                    scrollEventThrottle={16}
                    style={{borderWidth:1}}
                    data={this.state.repos || []}
                    extraData={this.state.repos}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onScroll={this.scrollSinkY}
                />
    */
    // }

    scrollSinkY = (e) => {
        const y = e.nativeEvent.contentOffset.y
        if (y < 50 && y > 0) {
            this.state.headerHeight.setValue(y)
        }
    };

    render() {
        const {searchText} = this.state

        const h = this.state.headerHeight.interpolate({
            inputRange: [0, 50],
            outputRange: [250, 60],
        })
        const w = this.scrollPos.interpolate({
            inputRange: [0, 1],
            outputRange: ['90%', '99.6%'],
            useNativeDriver: true,
        })

        return (
            <View style={styles.wrap}>

                <AnimatedFlatList
                    scrollEventThrottle={1}
                    style={{borderWidth:1, maxHeight: 400}}
                    data={this.state.repos || []}
                    extraData={this.state.repos}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onScroll={this.scrollSinkY}
                />

                <Animated.View style={[styles.header, {height: h}]}>
                    <Animated.View style={[styles.searchWrap]}>
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
                    </Animated.View>
                </Animated.View>
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
        position: 'absolute',
        paddingTop: 24,
        height: 250,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30,144,255,0.6)'
    },
    searchWrap: {
        width: '90%',
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
    repos: state.searchedRepos.repos,
    auth: state.userSignInfo.auth,
})
export default connect(bindMainState, bindActions({searchRepo, userSignAccept}))(Test)
