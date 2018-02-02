import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native';

const styles = StyleSheet.create({
    buttonBox: {flex: 1, alignItems: 'center', paddingVertical: 12},
    buttonBoxDisabled: {backgroundColor: '#dfdfdf'},
    buttonTitle: {fontSize: 14, color: '#80B2FE', fontWeight: '400'},
    buttonTitleDisabled: {color: '#ffffff'}
});

export class CButton extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        title: PropTypes.string.isRequired,
        style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        titleStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array])
    }

    render() {
        const {title, onPress, style, titleStyle, disabled} = this.props;
        const viewStyle = [styles.buttonBox].concat(isType(style) === 'Array' ? style : [style]);
        const textStyle = [styles.buttonTitle].concat(isType(titleStyle) === 'Array' ? titleStyle : [titleStyle]);
        const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

        if (disabled) {
            viewStyle.push(styles.buttonBoxDisabled);
            textStyle.push(styles.buttonTitleDisabled)
        }

        return (
            <Touchable onPress={onPress} disabled={disabled}>
                <View style={viewStyle}>
                    <Text style={textStyle}>{title}</Text>
                </View>
            </Touchable>
        )
    }
}
