/**
 * 自定义modal, 以 C 开头
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Modal, View, TouchableWithoutFeedback} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {closeModal, bindActions} from '../reducers/comReducer'
import {Button} from '../components'

export default connect(state => ({ui: state.comInfo}), bindActions({closeModal}))((props) => {
    const {modalOpen, cancelShow, ele, maskingShow} = props.ui;
    if (!modalOpen) return null;

    return (
        <Modal
            animationType={"fade"}
            transparent={true}
            visible={modalOpen}
            onRequestClose={() => console.log("Modal has been closed.")}>
            <View style={styles.wrap}>
                {
                    maskingShow
                        ? (
                            <TouchableWithoutFeedback onPress={props.closeModal}>
                                <View style={styles.masking}/>
                            </TouchableWithoutFeedback>)
                        : null
                }

                <View style={{flex: 1}}>{ele}</View>
                {
                    cancelShow
                        ? <Button style={styles.closeBox}
                                  content={<EvilIcons name={'close'} size={32}/>}
                                  onPress={props.closeModal}/>
                        : null
                }
            </View>
        </Modal>
    )
})

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'rgba(8,8,8, .4)'
    },
    masking: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
    },
    closeBox: {
        width: 280,
        height: 42,
        marginBottom: 10,
        borderRadius: 2,
        alignSelf: 'center',
        backgroundColor: '#fff'
    }
});
