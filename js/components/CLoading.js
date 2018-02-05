import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native'

const {sin, abs, cos} = Math;

const cSin = (deg) => {
    return 1 + 3 * abs(sin(deg))
};

class Loading extends PureComponent {
    load = [3, 2, 1];
    animation = new Animated.Value(0);

    componentDidMount() {
        this.startAnimation()
    }

    startAnimation = () => {
        this.animation.setValue(0);
        Animated.timing(this.animation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start(() => {
            this.startAnimation()
        })
    }

    render() {

        const scaleYs = this.load.map((item, index) => {
            const scaleY = index * Math.PI / 4;
            // console.log(scaleY)
            return this.animation.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                // outputRange: [1,3, 1]
                outputRange: [cSin(scaleY), cSin(Math.PI / 4 + scaleY), cSin(Math.PI / 2 + scaleY), cSin(Math.PI * 3 / 4 + scaleY), cSin(Math.PI + scaleY)]
            })
        });

        return (
            <View style={{flexDirection: 'row'}}>
                {
                    scaleYs.map((item, index) => {
                        return (
                            <Animated.View
                                key={'Animated' + index}
                                style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: '#80B2FE',
                                    marginHorizontal: 2,
                                    transform: [{scaleY: item}]
                                }}/>
                        )
                    })
                }
            </View>
        )
    }
}

export default Loading;
