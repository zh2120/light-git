/**
 * 自定义modal, 以 C 开头
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Modal, View, Text} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {closeModal, bindActions} from '../reducers/comReducer'
import {Button} from '../components'

export default connect(state => ({ui: state.comInfo}), bindActions({closeModal}))(
    class extends PureComponent {
        render() {
            const {modalOpen, cancelShow, ele} = this.props.ui;
            if (!modalOpen) return null;

            return (
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={modalOpen}
                    onRequestClose={() => console.log("Modal has been closed.")}>
                    <View style={styles.wrap}>
                        <View style={{flex: 1}}>
                            {ele}
                        </View>
                        {
                            cancelShow
                                ? <Button style={styles.closeBox}
                                          content={<EvilIcons name={'close'} size={32}/>}
                                          onPress={this.props.closeModal}/>
                                : null
                        }
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
    closeBox: {
        width: 350,
        height: 42,
        marginBottom: 10,
        borderRadius: 2,
        alignSelf: 'center',
        backgroundColor: '#fff'
    }
})