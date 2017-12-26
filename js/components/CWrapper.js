import React, {Component} from 'react';
import {View, Text} from 'react-native'

export default class CWrapper extends Component {



    render() {
        console.log('test ')
        console.log(this.props)
        return (
            <View style={{flex: 1}}>
                {this.props.children}
                <Text style={{color: 'red'}}>sdga</Text>
            </View>
        )
    }
}
