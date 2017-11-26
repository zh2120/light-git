import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import {Button, Loading, CList} from '../../components'
import {repoContent, clearDir} from '../../reducers/repoReducer'
import {getIssue} from '../../reducers/issueReducer'
import {openModal, bindActions, back} from '../../reducers/comReducer'

const pr = 'PR';
const wiki = 'Wiki';
const Code = 'contents';
const Issues = 'issues';
const Insights = 'insights';

export default connect(({nav, repoInfo, issueInfo}) => ({
    nav: nav,
    dirs: repoInfo.dirs,
    readme: repoInfo.readme,
    content: repoInfo.content,
    codeRefreshing: repoInfo.getting,
    issuesData: issueInfo.issues,
    issueRefreshing: issueInfo.getting
}), bindActions({repoContent, clearDir, back, openModal, getIssue}))(
    class extends PureComponent {
        static navigationOptions = ({navigation}) => {
            const {params} = navigation.state;
            return {headerTitle: params && params.name}
        };

        constructor(props) {
            super(props);
            const {params} = props.navigation.state;
            this.state = {
                navName: '',
                fullName: params ? params.fullName : ''
            };
            this.navBtns = [
                {name: Code},
                {name: Issues},
                // {name: pr},
                // {name: wiki},
                // {name: Insights},
            ];
        }

        componentDidMount() {
            const {fullName} = this.state;

            if (fullName) {
                this.getNavContent(fullName, Code)
            }
        }

        // todo， 如果出现错误信息，返回上一页

        componentWillUnmount() {
            // 清理仓库主页
            this.props.clearDir()
        }

        /**
         * 渲染导航栏
         * @returns {Array} 导航按钮组
         */
        renderNav = () => {
            const {navName, fullName} = this.state;

            return this.navBtns.map((item, index) => {
                const cur = navName === item.name;
                return (
                    <Button
                        key={index}
                        content={<Text style={{color: cur ? '#e36209' : '#333'}}>{item.name}</Text>}
                        style={styles.navBtn}
                        onPress={() => cur ? null : this.getNavContent(fullName, item.name)}/>
                )
            })
        };

        /**
         *
         * @param fullName
         * @param type contents | issues
         * @returns {*}
         */
        getNavContent = (fullName, type) => {
            const {getIssue, repoContent} = this.props;
            const url = '/repos/' + fullName + `/${type}` + getParams({ref: 'master', page: 1});
            let press;

            switch (type) {
                case Code:
                    press = repoContent;
                    break;
                case Issues:
                    press = getIssue;
                    break
            }

            if (this.state.navName === type) return null;

            press(url); // 不同按钮之间的切换，才请求数据
            return this.setState({navName: type})
        };

        refreshController = (isRefreshing) => <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this.onRefreshing}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#0000ff', '#00ff00', '#ff0000',]}
            progressBackgroundColor="#fff"
        />;

        onRefreshing = () => {
            const {fullName, navName} = this.state;

            return this.getNavContent(fullName, navName)
        };

        /**
         * 渲染目录或者文件
         * @param item 每行元素
         * @returns {XML}
         */
        renderDirOrFile = ({item}) => {
            const {type, path, name} = item;
            const {navigation} = this.props;
            const isDir = type === 'dir'; // 是否是目录

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
         * 渲染问题列表
         * @param item
         * @returns {XML}
         */
        renderIssues = ({item}) => {
            const {title, user, comments, number} = item;
            const {fullName} = this.state;
            const {navigation} = this.props;

            return (
                <TouchableHighlight onPress={() => navigation.navigate('RepoIssues', {fullName, number})}
                                    underlayColor={'rgba(100,100,100 ,0.1)'}>
                    <View style={styles.issueBox}>
                        <View>
                            <Text style={{color: '#333'}}>{'#' + number}</Text>
                            <Image source={{uri: user.avatar_url}} style={styles.avatarBox}/>
                        </View>
                        <View style={styles.issueDescBox}>
                            <Text style={styles.titleText}>{title}</Text>
                        </View>
                        <Text style={styles.titleText}>{comments}</Text>
                    </View>
                </TouchableHighlight>
            )
        };

        /**
         * 渲染导航对应的内容
         * @returns {XML}
         */
        renderNavContainer = () => {
            const {navName} = this.state;

            switch (navName) {
                case Code:
                    const {content, codeRefreshing} = this.props;
                    // 内容为空，从云上下载
                    if (!content) return <View style={{height: dp(250)}}><Loading/></View>;

                    return (
                        <CList
                            data={content}
                            renderItem={this.renderDirOrFile}
                            refreshControl={this.refreshController(codeRefreshing)}/>
                    );
                case Issues:
                    const {issuesData, issueRefreshing} = this.props;
                    if (!issuesData) return <View style={{height: dp(250)}}><Loading/></View>;

                    return (
                        <CList
                            data={issuesData}
                            renderItem={this.renderIssues}
                            refreshControl={this.refreshController(issueRefreshing)}/>
                    );
                default:
                    return null;
            }
        };

        render() {
            return (
                <View style={styles.wrap}>
                    <View style={styles.navBox}>
                        {this.renderNav()}
                    </View>
                    {
                        this.renderNavContainer()
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
    contentName: {marginLeft: 6},
    titleText: {fontSize: 16, color: '#333'},
    issueDescBox: {flex: 1, marginHorizontal: 16},
    avatarBox: {width: 32, height: 32, borderRadius: 16},
    contentRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16},
    issueBox: {flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, paddingHorizontal: 16}
};
