import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Animated, Text, StyleSheet, Easing, TouchableWithoutFeedback } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { closeToast, bindActions } from '../reducers/comReducer'


export default connect(state => ({
    signed: state.userSignInfo.signed,
    comInfo: state.comInfo
}), bindActions({ closeToast }))(
    class extends PureComponent {
        constructor(props) {
            super(props)
            this.state = {
                opacity: new Animated.Value(0)
            }
        }

        componentWillMount() {
            const { opacity } = this.state;
            this.animationOpen = Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.poly(4))
            });
            this.animationClose = Animated.timing(opacity, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.poly(4))
            })
            // console.log('-> ',this.props.persistor)

        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.comInfo.toastOpened) {
                this.animationOpen.start(() => {
                    this.timer && clearTimeout(this.timer);
                    this.timer = setTimeout(() => this.close(), 3000) // 3s 后触发关闭toast
                })
            }
        }

        componentDidMount() {
            const { signed, persistor } = this.props;

            if (!signed) {
                // console.log('persistor.purge')
                // persistor.purge() // 持久化存储的
            }
        }

        close = () => { // 延时关闭toast
            this.animationClose.start(() => {
                this.timer && clearTimeout(this.timer);
                this.props.closeToast()
            }) // 关闭toast，清除定时器
        };

        render() {
            const { toastOpened, text, success } = this.props.comInfo

            if (!toastOpened) return null;

            const { opacity } = this.state;

            return (
                <TouchableWithoutFeedback onPress={this.props.closeToast}>
                    <Animated.View style={[ styles.common, { opacity: opacity } ]}>
                        <Text style={styles.toastText}>{text}</Text>
                        <MaterialCommunityIcons style={{ color: success ? '#ffffff' : 'red', marginLeft: 10 }} size={20}
                                                name={success ? 'checkbox-marked-circle-outline' : 'sword-cross'}/>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )
        }
    }
)

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
        color: '#ffffff',
        fontSize: 14
    }
})
