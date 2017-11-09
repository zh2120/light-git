import React, {Component} from 'react'
import {View, StyleSheet, Animated, Text} from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

const SimpleIcon = Animated.createAnimatedComponent(SimpleLineIcons)

export default class Loading extends Component {

    value = new Animated.Value(0)

    fade = this.value.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.5, 0.9],
    })

    scale = this.value.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.6, 1],
    })

    componentDidMount() {
        this.startAniamte()
    }

    startAniamte = () => {
        Animated.timing(this.value, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start(() => {
            this.value.setValue(0)
            this.startAniamte()
        })
    };

    render() {
        const {name} = this.props
        return (
            <View style={styles.wrap}>
                <SimpleIcon
                    name={name || 'cloud-download'} size={32}
                    style={{
                        opacity: this.fade, transform: [{scale: this.scale}],
                        color: 'rgb(30,144,255)'
                    }}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 18,
        color: '#333'
    }
})