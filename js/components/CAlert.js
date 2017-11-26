import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {StyleSheet, View, Text} from 'react-native'
import {bindActions, closeModal} from '../reducers/comReducer'
import {Button} from '../components'

export default connect(state => ({}), bindActions({closeModal}))(class extends PureComponent {

    static propTypes = {
        title: PropTypes.string.isRequired,
        text: PropTypes.string,
        actions: PropTypes.array
    }

    /**
     * 渲染提示标题
     * @param title 标题内容
     * @returns {*}
     */
    renderTitle = (title) => {
        if (!title) return null;

        return (<Text style={styles.text}>{title}</Text>)
    };

    /**
     * 渲染提示文本
     * @param text 文本
     * @returns {*}
     */
    renderText = (text) => {
        if (!text) return null;

        return (<Text style={styles.text}>{text}</Text>)
    };

    renderBtnArr = (actions) => {
        if (!Array.isArray(actions)) return null;

        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={styles.line}/>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    {
                        actions.map((item, index) => (
                            <Button content={<Text style={{fontSize: 14}}>{item.text || 'ok'}</Text>}
                                    style={styles.btnBox}
                                    onPress={() => {
                                        setTimeout(this.props.closeModal, 100); // 延时关闭
                                        return item.onPress() || null
                                    }}
                                    key={'cAlert' + index}/>
                        ))
                    }
                </View>
            </View>
        )
    };

    render() {
        const {title, text, actions} = this.props;

        return (
            <View style={styles.wrap}>
                <View style={styles.cBox}>
                    {this.renderTitle(title)}
                    {this.renderText(text)}
                    {this.renderBtnArr(actions)}
                </View>
            </View>
        )
    }
})

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        marginVertical: 6,
        color: '#333',
    },
    cBox: {
        width: 280,
        borderRadius: 2,
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    line: {
        marginTop: 12,
        width: 200,
        height: 0.5,
        backgroundColor: '#cdcdcd'
    },
    btnBox: {flex: 1, height: 40}
});
