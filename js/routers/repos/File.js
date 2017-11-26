import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Text, ScrollView, StyleSheet} from 'react-native'
import {Loading} from '../../components'
import {openToast, bindActions} from '../../reducers/comReducer'
import {fileContent, getFileDenied} from '../../reducers/repoReducer'

export default connect(({repoInfo}) => ({file: repoInfo.file}), bindActions({
    fileContent,
    openToast,
    getFileDenied
}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            const params = navigation.state.params;
            return {
                headerTitle: params && params.path,
                headerBackTitle: null
            }
        };

        constructor(props) {
            super(props);
            this.state = {
                fullName: props.navigation.state.params.fullName || '',
                path: props.navigation.state.params.path || ''
            }
        }

        componentDidMount() {
            const {navigation, fileContent} = this.props;

            if (navigation.state.params) {
                const {fullName, path} = navigation.state.params;

                fileContent({fullName, path})
            }
        }

        componentWillUnmount() {
            this.props.getFileDenied() // 清除当前文件
        }

        render() {
            const {file} = this.props;

            if (isEmpty(file)) return <Loading/>;

            return (
                <ScrollView contentContainerStyle={styles.wrap}>
                    <Text style={styles.fileText}>{file}</Text>
                </ScrollView>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {padding: 8},
    fileText: {fontSize: 14, fontFamily: 'Arial', lineHeight: 22, color: '#333'}
});

