import React, {Component, Children} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native'
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
        paddingTop: 18,
        paddingBottom: 14,
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
    },
    contentText: {
        paddingVertical: 8,
    }
});

class CAlert extends Component {
    initialState = {
        visibility: false,
        title: '提示',
        content: null, // 可以是字符串，可以是组件
        actions: [], //必须是数组
    };

    state = {...this.initialState};
    animation = new Animated.Value(0);

    show = (refTitle, refContent, refActions) => {
        const {title, content, actions} = this.state;
        const newTitle = isType(refTitle) === 'String' && refTitle || title;
        const newContent = refContent || content;
        const newActions = isType(refActions) === 'Array' && refActions || actions;

        this.setState({visibility: true, title: newTitle, content: newContent, actions: newActions}, () => {
            Animated.timing(this.animation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }).start()
        })
    };

    close = (callback) => {
        const {visibility} = this.state;
        if (visibility) {
            if (callback) {
                callback()
            }
            Animated.timing(this.animation, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }).start(() => this.setState({...this.initialState}))
        }
    };

    renderContent() {
        const {content} = this.state;
        switch (isType(content)) {
            case 'String':
                return (<Text style={styles.contentText}>{content}</Text>);
            case 'Object':
                // 是一个组件对象
                return Children.only(content);
            default:
                return null;
        }
    }

    renderActions = () => {
        const {actions} = this.state;
        return isEmpty(actions)
            ? null
            : (<View style={styles.btnBox}>
                {
                    actions.map((action, index) => (
                        <CButton key={`CButton_${index}`} title={action.text}
                                 onPress={() => this.close(action.onPress)}/>))
                }
            </View>)
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
                        {this.renderContent()}
                        {this.renderActions()}
                    </View>
                </Animated.View>
            )
            : null

    }
}

export default {
    instance: null,
    show: (title, content, actions) => {
        if (!this.instance) {
            (new AppWrapper(<CAlert
                ref={re => (this.instance = re)}/>)).subScribe(() => this.instance.show(title, content, actions))
        } else {
            this.instance.show(title, content, actions)
        }
    },
    close: () => {
        if (this.instance) {
            this.instance.close()
        }

    }
}

