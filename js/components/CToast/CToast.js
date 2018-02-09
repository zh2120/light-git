import React, { PureComponent } from 'react';
import { Animated, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Icon } from '../../components'

const styles = StyleSheet.create({
    common: {
        top: ios ? 64 : 44,
        right: 0,
        height: 40,
        position: 'absolute',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingLeft: 16,
        paddingRight: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 20,
        flexDirection: 'row',
        borderBottomLeftRadius: 20
    },
    toastText: {
        color: '#333333',
        fontSize: 14
    }
});

class CToast extends PureComponent {
    initialState = {
        visibility: false,
        text: ''
    };
    state = { ...this.initialState };
    animation = new Animated.Value(0);
    openFlag = false;

    open = (text = '') => {
        if (this.timer) clearTimeout(this.timer);
        this.openFlag = true;
        return this.setState({ visibility: true, text }, () => {
            this.start(() => this.timer = setTimeout(this.close, 3000))
        })
    };

    close = () => { // 延时关闭toast
        const { visibility } = this.state;
        if (visibility) {
            this.openFlag = false;
            this.start(() => {
                if (this.timer) clearTimeout(this.timer);
                this.setState({ ...this.initialState })
            });
        }
    };

    start = (callback) => {
        Animated.timing(this.animation, {
            toValue: this.openFlag ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => callback && callback());
    };

    render() {
        const { visibility, text } = this.state;

        if (!visibility) return null;

        const opacity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 1]
        });

        const translateX = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [vw, 0]
        });

        return (
            <TouchableWithoutFeedback onPress={this.close}>
                <Animated.View style={[styles.common, { opacity, transform: [{ translateX }] }]}>
                    <Text style={styles.toastText}>{text}</Text>
                    <Icon style={{ marginLeft: 10 }} size={20}
                          name={'circle'}/>
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}

export default CToast;
