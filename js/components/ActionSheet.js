import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Modal, View, Text} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {closeActionSheet, bindActions} from '../reducers/comReducer'
import {Button} from '../components'

export default connect(state => ({opened: state.comInfo.actionSheetOpen}), bindActions({closeActionSheet}))(
    class extends PureComponent {
        render() {
            const {opened} = this.props;
            if (!opened) return null;

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
                                <Text>加载中</Text>
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
        flex: 1,
        backgroundColor: 'transparent',
    },
    closeBox: {
        width: vw - 24,
        height: 42,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 2
    }
})