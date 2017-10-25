/**
 * Navigator.js
 * 导航器
 * @author traveller
 * @date create 2017.10.11 23:00:00
 */
import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons';

class Navigator extends PureComponent {

    static propTypes = {
        navigation: PropTypes.object,
        left: PropTypes.func
    }

    /**
     * 左侧返回按钮或者标题
     * @returns {XML}
     */
    renderLeft = () => {
        const {left, navigation} = this.props
        if (typeof left === 'function') {
            return (
                <View style={{marginLeft: 10}}>
                    {left()}
                </View>
            )
        }
        // 默认返回
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.contentLeft}>
                        <Ionicons
                            name={'md-arrow-back'}
                            size={24}
                            style={{color: '#000'}}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.colLine}/>
            </View>
        )
    }

    renderRight = () => {
        return (
            <View style={styles.contentRight}>
                <Text></Text>
                <View><Text>sdkgkas</Text></View>
            </View>
        )
    }

    render() {
        return (
            <Animated.View style={styles.wrap}>
                {this.renderLeft()}
                {this.renderRight()}
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        height: 44,
        width: '100%',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    colLine: {
        height: 16,
        width: 1,
        marginRight: 6,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    contentLeft: {
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default Navigator