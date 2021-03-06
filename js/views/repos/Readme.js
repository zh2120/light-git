import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, WebView, Text } from 'react-native'
import { openToast, bindActions } from '../../reducers/comReducer'
import { fileContent, getFileDenied } from '../../reducers/repoReducer'
import { html, md, Loading } from '../../components'

export default connect(({ repoInfo }) => ({ readme: repoInfo.readme }), bindActions({
    fileContent,
    openToast,
    getFileDenied
}))(
    class extends Component {
        static navigationOptions = ({ navigation }) => {
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
            const { navigation, fileContent } = this.props;

            if (navigation.state.params) {
                const { fullName, path } = navigation.state.params;

                fileContent({ fullName, path })
            }
        }

        componentWillUnmount() {
            this.props.getFileDenied() // 清除当前文件
        }

        render() {
            const { readme } = this.props;

            if (!readme) return <Loading/>;

            // console.log('md(readme)', html(md(readme)));

            return (
                <View>
                    <Text>正在开发</Text>
                </View>
            )
            // return (
            //     <WebView
            //         style={styles.wrap}
            //         userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'}
            //         source={{ html: html(md(readme)) }}/>
            // )
        }
    }
)

const styles = StyleSheet.create({
    wrap: { flex: 1 },
});
