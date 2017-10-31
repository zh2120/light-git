import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableHighlight, TouchableNativeFeedback, StyleSheet} from 'react-native'

class Button extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        content: PropTypes.any,
        icon: PropTypes.any,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
    }

    static defaultProps = {
        content: (<Text>button</Text>),
        disabled: false,
        style: {},
        onPress: () => {
        }
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {content, style, onPress, disabled, icon} = this.props
        const finalStyle = [styles.wrap, disabled && styles.disable, style]
        if (ios) {
            return (
                <TouchableHighlight
                    underlayColor={'rgba(100,100,100 ,0.1)'}
                    disabled={disabled}
                    onPress={onPress}
                    style={finalStyle}>
                    <View style={[icon && styles.icon]}>
                        {
                            icon ? icon : null
                        }
                        {content}
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                disabled={disabled}
                onPress={onPress}>
                <View style={finalStyle}>
                    {
                        icon ? icon : null
                    }
                    {content}
                </View>
            </TouchableNativeFeedback>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    disable: {
        backgroundColor: '#dcdcdc'
    }
})

export default Button