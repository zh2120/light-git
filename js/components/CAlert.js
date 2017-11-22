/**
 * 自定义Alert, 以 C 开头
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Modal, View, Text} from 'react-native'
import { bindActions} from '../reducers/comReducer'
import {Button} from '../components'

export default class extends Component {
    render() {

        return (
            <View style={styles.wrap}>
                <Text>alert12</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
});
