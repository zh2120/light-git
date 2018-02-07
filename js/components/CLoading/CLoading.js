import React, {PureComponent} from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types';

const {PI, abs, sin} = Math;

const cSin = (deg) => 2 * abs(sin(deg)) + 0.1;

const styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    wBox: {
        paddingVertical: 12,
        width: 200,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        borderRadius: 4,
        justifyContent: 'center'
    },
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

class CLoading extends PureComponent {
    static propTypes = {
        only: PropTypes.bool,
        duration: PropTypes.number,
        count: PropTypes.number,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
        blockStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array])
    };

    initialState = {text: '', visibility: false};

    state = {...this.initialState};
    load = (new Array(this.props.count || 3)).fill(1);
    animation = new Animated.Value(0);
    loading = true;

    componentDidMount() {
        if(!this.props.only) {
            this.setState({visibility: true},  this.startAnimation)
        }
    }

    componentWillUnmount() {
        this.close();
        this.load = false
    }

    open = (text = '') => {
        if (!this.state.visibility) {
            this.setState({text, visibility: true}, this.startAnimation)
        }
    };

    close = () => this.setState({...this.initialState});

    startAnimation = () => {
        const {duration} = this.props;
        this.animation.setValue(0);
        Animated.timing(this.animation, {
            toValue: 1,
            duration: duration || 2000,
            useNativeDriver: true
        }).start(() => {
            if (this.load) {
                this.startAnimation()
            } else {
                this.animation = null
            }
        })
    };

    render() {
        const {text, visibility} = this.state;
        if (!visibility) return null;

        const scaleYs = this.load.map((item, index) => {
            const scaleY = index * PI / 4;
            return this.animation.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [cSin(scaleY), cSin(PI / 4 + scaleY), cSin(PI / 2 + scaleY), cSin(PI * 3 / 4 + scaleY), cSin(PI + scaleY)]
            })
        });
        const {style, blockStyle, only} = this.props;

        const vStyle = [styles.box].concat(isType(style) === 'Array' ? style : [style]);
        const bStyle = [styles.block].concat(isType(blockStyle) === 'Array' ? blockStyle : [blockStyle]);

        return (
            <View style={[styles.wrap, only ? {backgroundColor: 'rgba(21, 21, 21, 0.3)'} : null]}>
                <View style={styles.wBox}>
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
                    <Text>{text}</Text>
                </View>
            </View>
        )
    }
}

export default CLoading;
