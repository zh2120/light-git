import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Animated, Text, StyleSheet, Easing, TouchableWithoutFeedback} from 'react-native'
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
        // console.log('-> ',this.props.persistor)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.commons.toastOpened) {
            this.animationOpen.start(() => {
                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(() => this.props.closeToast(), 3000) // 3s 后触发关闭toast
            })
        } else {
            this.animationClose.start(() => this.timer && clearTimeout(this.timer)) // 关闭toast，清除定时器
        }
    }

    componentDidMount() {
        // this.animationOpen.start()
        const {signed, persistor} = this.props
        console.log('signed', signed)
        if (!signed) {
            console.log('persistor.purge')
            // persistor.purge() // 持久化存储的
        }
    }

    render() {
        const {toastOpened, text, success} = this.props.commons

        if (!toastOpened) return null

        const {opacity} = this.state

        return (
            <TouchableWithoutFeedback onPress={this.props.closeToast}>
                <Animated.View style={[styles.common, {opacity: opacity}]}>
                    <Text style={styles.toastText}>{text}</Text>
                    <MaterialCommunityIcons style={{color: success ? '#fff' : 'red', marginLeft: 10}} size={20}
                                            name={success ? 'checkbox-marked-circle-outline' : 'sword-cross'}/>
                </Animated.View>
            </TouchableWithoutFeedback>

        )
    }
}

const styles = StyleSheet.create({
    common: {
        top: ios ? 64 : 44,
        right: 0,
        height: 40,
        position: 'absolute',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        paddingLeft: 16,
        paddingRight: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 20,
        flexDirection: 'row',
        borderBottomLeftRadius: 20
    },
    toastText: {
        color: '#fff',
        fontSize: 14
    }
})

const bindState = state => ({
    signed: state.userSignInfo.signed,
    commons: state.commons
})

export default Toast = connect(bindState, bindActions({closeToast}))(ToastCommon)