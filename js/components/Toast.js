import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Animated, Text, StyleSheet, Easing} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {bindActions} from '../actions'
import {closeToast} from '../actions/common'

class ToastCommon extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0)
        }
    }

    componentWillMount() {
        const {opacity} = this.state
        this.animationOpen = Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.poly(4))
        })
        this.animationClose = Animated.timing(opacity, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.poly(4))
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.commons.toastOpened) {
            this.animationOpen.start(() => {
                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(() => this.props.closeToast(), 3000) // 1.5s 后触发关闭toast
            })
        } else {
            this.animationClose.start(() => this.timer && clearTimeout(this.timer)) // 关闭toast，清除定时器
        }
    }

    componentDidMount() {
        // this.animationOpen.start()
    }

    render() {
        const {toastOpened, text} = this.props.commons

        if (!toastOpened) return null

        const {opacity} = this.state
        return (
            <Animated.View style={[styles.common, {opacity: opacity}]}
                           pointerEvents="none">
                <Text style={styles.toastText}>{text}</Text>
                <MaterialCommunityIcons style={{color: toastOpened ? 'red' : '#fff', marginLeft: 8}} size={20}
                                        name={'sword-cross'}/>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    common: {
        top: ios ? 64 : 44,
        right: 0,
        height: 36,
        position: 'absolute',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        paddingLeft: 16,
        paddingRight: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 18,
        flexDirection: 'row',
        borderBottomLeftRadius: 18
    },
    toastText: {
        color: '#fff',
        fontSize: 16
    }
})

const bindState = state => ({
    signed: state.userSignInfo.signed,
    commons: state.commons
})

export default Toast = connect(bindState, bindActions({closeToast}))(ToastCommon)