import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import {Button, Loading} from '../../components/index'
import {bindActions, openToast} from '../../reducers/comReducer'
import {getRepoList} from '../../reducers/userReducer'

export default connect(({userInfo}) => ({
    publicPros: userInfo.public_repos,
    proList: userInfo.proList,
}), bindActions({getRepoList}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            return {headerTitle: 'Repositories'}
        };

        constructor(props) {
            super(props);
            this.state = {};

            /**
             * 列表通用属性ß
             */
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

        componentDidMount() {
            const {getRepoList} = this.props;
            getRepoList({username: ''})
        }


        /**
         * 返回每行key
         * @param item 每行元素
         * @param index 每行元素的索引
         */
        keyExtractor = (item, index) => 'repoList' + index;

        /**
         * 行分隔线
         */
        separator = () => <View style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: 'rgba(10,10,10, 0.2)'
        }}/>;

        /**
         * 渲染用户仓库的单个项目
         * @param pro 单个项目
         * @returns {XML}
         */
        renderProItem = ({item}) => {
            const {full_name, name, description, language, stargazers_count} = item;
            const {navigation} = this.props;
            const proItem = (
                <View>
                    <Text>{name}</Text>
                    <Text>{description}</Text>
                    <View>
                        <Text>{language}</Text>
                        <Text>{stargazers_count}</Text>
                    </View>
                </View>
            );
            return (
                <Button content={proItem} style={{height: dp(100), alignItems: 'flex-start'}}
                        onPress={() => navigation.navigate('RepoHome', {fullName: full_name, name: name})}/>
            )
        };

        render() {
            const {proList} = this.props;
            if (!proList) {
                return <View style={{height: dp(250)}}><Loading/></View>
            }

            return (
                <View style={styles.wrap}>
                    <FlatList
                        data={proList}
                        renderItem={this.renderProItem}
                        {...this.listProps}/>
                </View>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
