import React, { PureComponent, Children } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native'
import { CButton } from '../index'

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
        backgroundColor: '#ffffff',
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
        marginBottom: 10
    }
});

class CAlert extends PureComponent {
    initialState = {
        visibility: false,
        title: '提示',
        content: null, // 可以是字符串，可以是组件
        actions: [], //必须是数组
    };

    state = { ...this.initialState };
    animation = new Animated.Value(0);
    flag = false;

    open(refTitle, refContent, refActions) {
        const { title, content, actions } = this.state;
        const newTitle = isType(refTitle) === 'String' && refTitle || title;
        const newContent = refContent || content;
        const newActions = isType(refActions) === 'Array' && refActions || actions;
        this.flag = true;
        this.setState({ visibility: true, title: newTitle, content: newContent, actions: newActions }, this.start)
    };

    close(callback) {
        const { visibility } = this.state;
        if (visibility) {
            this.flag = false;
            if (callback) callback();
            this.start(() => this.setState({ ...this.initialState }))
        }
    };

    start = (callback) => {
        Animated.timing(this.animation, {
            toValue: this.flag ? 1 : 0,
            duration: 150,
            useNativeDriver: true
        }).start(() => callback && callback())
    };

    renderContent() {
        const { content } = this.state;
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
        const { actions } = this.state;
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
        const { visibility, title } = this.state;
        if (!visibility) return null;

        const opacity = this.animation.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0.1, 1 ]
        });

        return (
            <Animated.View style={[ styles.wrap, { opacity } ]}>
                <View style={styles.cBox}>
                    <Text style={styles.text}>{title}</Text>
                    {this.renderContent()}
                    {this.renderActions()}
                </View>
            </Animated.View>
        )
    }
}

export default CAlert;
