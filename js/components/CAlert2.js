import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, Button, TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native'
import AppWrapper from 'react-native-root-wrapper';
import {CButton} from '../components'
const styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(21, 21, 21, 0.3)'
    },
    text: {
        fontSize: 18,
        fontWeight: '400',
        paddingTop: 32,
        paddingBottom: 28,
        color: '#333333',
    },
    cBox: {
        width: 250,
        borderRadius: 4,
        paddingHorizontal: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    line: {
        marginTop: 12,
        width: 200,
        height: 0.5,
        backgroundColor: '#cdcdcd'
    },
    btnBox: {
        flexDirection: 'row',
        borderTopColor: '#E6E6E6',
        borderTopWidth: StyleSheet.hairlineWidth,
    }
});

class CAlert extends Component {
    state = {
        visibility: false,
        title: '提示',
        content: null, // 可以是字符串，可以是组件
        actions: [{text: '取消'}], //必须是数组
    };
    animation = new Animated.Value(0);

    componentDidMount() {
        this.show()
    }

    show = () => {
        const {title, content, actions} = this.state;
        const newTitle = isType(arguments[0]) === 'String' && arguments[0] || title;
        const newContent = arguments[1] || content;
        const newActions = isType(arguments[2]) === 'Array' && arguments[2] || actions;

        this.setState({visibility: true, title: newTitle, content: newContent, actions: newActions}, () => {
            Animated.timing(this.animation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }).start()
        })
    };

    close = () => {
        if (this.state.visibility) {
            Animated.timing(this.animation, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }).start(() => this.setState({visibility: false}))
        }
    };

    render() {
        const {visibility, title} = this.state;
        const opacity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 1]
        });
        return visibility
            ? (
                <Animated.View style={[styles.wrap, {opacity}]}>
                    <View style={styles.cBox}>
                        <Text style={styles.text}>{title}</Text>
                        <View style={styles.btnBox}>
                            <CButton title={'取消'} onPress={this.close}/>
                        </View>
                    </View>
                </Animated.View>
            )
            : null

    }
}

export default {
    instance: null,
    show: () => {
        if (!this.instance) {
            (new AppWrapper(<CAlert ref={re => (this.instance = re)}/>)).subScribe()
        } else {
            this.instance.show({})
        }
    },
    close: () => {
        if (this.instance) {
            this.instance.close()
        }

    }
}

