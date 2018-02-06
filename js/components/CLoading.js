import React, {PureComponent} from 'react';
import {View, Animated, StyleSheet} from 'react-native'
import PropTypes from 'prop-types';
const {PI, abs, sin} = Math;

const cSin = (deg) => 2 * abs(sin(deg)) + 0.1;

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    block: {
        width: 10,
        height: 20,
        backgroundColor: '#80B2FE',
        marginHorizontal: 2
    }
});

class Loading extends PureComponent {
    static propTypes = {
        duration: PropTypes.number,
        count: PropTypes.number,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
        blockStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array])
    };

    constructor(props) {
        super();
        this.load = (new Array(props.count || 4)).fill(1)
    }
    animation = new Animated.Value(0);
    loading = true;

    componentDidMount() {
        this.startAnimation()
    }

    componentWillUnmount() {
        this.load = false
    }

    startAnimation = () => {
        const {duration} = this.props;
        this.animation.setValue(0);
        Animated.timing(this.animation, {
            toValue: 1,
            duration: duration || 2000,
            useNativeDriver: true
        }).start(() => {
            console.log(12);
            if (this.load) {
                this.startAnimation()
            } else {
                this.animation = null
            }
        })
    };

    render() {
        const scaleYs = this.load.map((item, index) => {
            const scaleY = index * PI / 4;
            return this.animation.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [cSin(scaleY), cSin(PI / 4 + scaleY), cSin(PI / 2 + scaleY), cSin(PI * 3 / 4 + scaleY), cSin(PI + scaleY)]
            })
        });
        const {style, blockStyle} = this.props;

        const vStyle = [styles.box].concat(isType(style) === 'Array' ? style : [style]);
        const bStyle = [styles.block].concat(isType(blockStyle) === 'Array' ? blockStyle : [blockStyle]);

        return (
            <View style={vStyle}>
                {
                    scaleYs.map((item, index) => {
                        return (
                            <Animated.View
                                key={'Animated' + index}
                                style={[bStyle, {transform: [{scaleY: item}]}]}/>
                        )
                    })
                }
            </View>
        )
    }
}

export default Loading;
