import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, FlatList } from 'react-native'

export default class CList extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired,
        renderItem: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.listProps = {
            horizontal: false,
            keyExtractor: this.keyExtractor,
            showsVerticalScrollIndicator: false,
            ItemSeparatorComponent: this.separator,
            // 列表为空，
            ListEmptyComponent: () => <View
                style={{
                    height: dp(250),
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><Text>Welcome！</Text></View>
        };
    }

    /**
     * 返回每行key
     * @param item 每行元素
     * @param index 每行元素的索引
     */
    keyExtractor = (item, index) => 'c-list' + index;

    /**
     * 行分隔线
     */
    separator = () => <View style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    }}/>;

    render() {
        return (
            <FlatList {...this.listProps} {...this.props}/>
        )
    }
}

