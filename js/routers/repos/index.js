import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    WebView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import {Button, Loading} from '../../components'
import {repoContent, clearDir} from '../../reducers/repoReducer'
import {getIssue} from '../../reducers/issueReducer'
import {openActionSheet, bindActions, back} from '../../reducers/comReducer'

const pr = 'PR';
const wiki = 'Wiki';
const Code = 'code';
const Issues = 'issues';
const Insights = 'insights';

export default connect(state => ({
    nav: state.nav,
    dirs: state.repoInfo.dirs,
    readme: state.repoInfo.readme,
    content: state.repoInfo.content,
    issuesData: state.issueInfo.issues
}), bindActions({repoContent, clearDir, back, openActionSheet, getIssue}))(
    class extends PureComponent {
        static navigationOptions = ({navigation}) => {
            const params = navigation.state.params;
            return {
                headerTitle: params && params.name
            }
        }

        constructor(props) {
            super(props);
            const {params} = props.navigation.state
            this.state = {
                fullName: params ? params.fullName : '',
                navName: Code
            }
            this.hasMore = false
            this.navBtns = [
                {name: Code, onPress: this.getRepoCode},
                {name: Issues, onPress: this.getIssues},
                // {name: pr},
                // {name: wiki},
                // {name: Insights},
            ]
        }

        componentWillMount() {
            const {fullName} = this.state

            if (fullName) {
                this.getRepoCode(fullName)
            }
        }

        componentWillUnmount() {
            // todo 清理仓库主页
            this.props.clearDir()
        }

        getRepoCode = (fullName) => {
            const {repoContent} = this.props;
            const url = '/repos/' + fullName + '/contents' + getParams({ref: 'master', page: 1})

            return this.setState(() => {
                repoContent(url)
                return {navName: Code}
            })
        }

        getIssues = (fullName) => {
            const {getIssue} = this.props;
            const url = '/repos/' + fullName + '/issues' + getParams({ref: 'master', page: 1})

            return this.setState(() => {
                getIssue(url)
                return {navName: Issues}
            })
        }

        /**
         * 返回每行key
         * @param item 每行元素
         * @param index 每行元素的索引
         */
        keyExtractor = (item, index) => 'dirORFile' + index;

        /**
         * 渲染目录或者文件
         * @param item 每行元素
         * @returns {XML}
         */
        renderDirOrFile = ({item}) => {
            const {type, path, name} = item
            const {navigation} = this.props
            const isDir = type === 'dir' // 是否是目录

            // todo 添加分支的请求

            return (
                <TouchableOpacity
                    onPress={() => isDir
                        ? navigation.navigate('RepoDir', {fullName: this.state.fullName, name, path})
                        : item.name === 'README.md'
                            ? navigation.navigate('Readme', {fullName: this.state.fullName, path, type})
                            : navigation.navigate('RepoFile', {fullName: this.state.fullName, path, type})}>

                    <View style={styles.contentRow}>
                        <Octicons name={isDir ? 'file-directory' : 'file'} size={24} style={{color: '#888'}}/>
                        <Text style={styles.contentName}>
                            {name}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        };

        /**
         * 行分隔线
         */
        separator = () => <View style={styles.separator}/>;

        renderNav = () => {
            const {navName, fullName} = this.state

            return this.navBtns.map((item, index) => {
                const cur = navName === item.name
                return (
                    <Button
                        key={index}
                        content={<Text style={{color: cur ? '#e36209' : '#333'}}>{item.name}</Text>}
                        style={styles.navBtn}
                        onPress={() => cur ? null : item.onPress(fullName)}/>
                )
            })
        }

        renderNacContainer = () => {
            const {navName} = this.state

            switch (navName) {
                case Code:
                    const {content} = this.props;
                    return (
                        <FlatList
                            horizontal={false}
                            data={content}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={this.separator}
                            contentContainerStyle={{padding: 14}}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderDirOrFile}/>
                    );
                case Issues:
                    const {issuesData} = this.props
                    console.log('--> ', issuesData)
                    return;
                default :
                    return;
            }
        }

        render() {
            const {content} = this.props;

            return (
                <View style={styles.wrap}>
                    <View style={styles.navBox}>
                        {this.renderNav()}
                    </View>
                    {
                        isEmpty(content)
                            ? <Loading/>
                            : this.renderNacContainer()
                    }
                </View>
            )
        }
    })

const styles = {
    wrap: {flex: 1, backgroundColor: '#fff'},
    starWrap: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginVertical: 12
    },
    starButton: {
        borderRadius: 2,
        marginBottom: 8,
        overflow: 'hidden',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: StyleSheet.hairlineWidth
    },
    navBox: {
        height: 36,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f7'
    },
    navBtn: {
        flex: 1,
        height: '100%'
    },
    contentRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4},
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    },
    contentName: {marginLeft: 6}
};
