import React, {PureComponent, Component} from 'react'
import {connect} from 'react-redux'
import {Animated, Text, StyleSheet, Easing, TouchableWithoutFeedback, View} from 'react-native'
import {bindActions} from '../actions'

export default connect(state => ({}), bindActions({}))(
    class extends Component {
        render() {
            return (
                <View style={styles.wrap}>
                    <Text>actionsheet</Text>
                </View>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'red'
    }
})