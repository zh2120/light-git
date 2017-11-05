import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Modal, View} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {bindActions} from '../actions'
import {closeActionSheet} from '../actions/common'
import {Button} from '../components'

export default connect(state => ({opened: state.commons.actionSheetOpen}), bindActions({closeActionSheet}))(
    class extends Component {
        render() {
            const {opened} = this.props

            return (
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={opened}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}>
                    <View style={styles.wrap}>
                        <View style={styles.box}>
                            <View style={styles.actionBox}>

                            </View>
                            <Button style={styles.closeBox}
                                    content={<EvilIcons name={'close'} size={32}/>}
                                    onPress={this.props.closeActionSheet}/>
                        </View>
                    </View>
                </Modal>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'rgba(8,8,8, .4)'
    },
    box: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    actionBox: {
        width: vw - 24,
        height: 100,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 2

    },
    closeBox: {
        width: vw - 24,
        height: 42,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 2
    }
})