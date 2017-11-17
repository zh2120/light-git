import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, Button, TextInput} from 'react-native'
import {bindActions} from '../../reducers/comReducer'

export default connect(state => ({}), bindActions({}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            const {params} = navigation.state;
            return {
                headerTitle: params && String(params.name),
                headerTitleStyle: {color: 'rgba(255,255,255,0.8)'},
                headerBackTitleStyle: {color: 'rgba(255,255,255,0.8)'},
                headerStyle: {
                    backgroundColor: '#000'
                }
            }
        };

        constructor(props) {
            super(props)
            this.state = {}
        }

        componentDidMount() {
        }


        render() {

            return (
                <View style={styles.wrap}>
                    <Text>用户首页</Text>
                </View>
            )
        }
    }
)

const styles = {
    wrap: {
        flex: 1
    }
}
