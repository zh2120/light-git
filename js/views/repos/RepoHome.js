import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import { Button, Loading, CList, Icon } from '../../components'
import { repoContent, clearDir } from '../../reducers/repoReducer'
import { getIssue, errIssue } from '../../reducers/issueReducer'
import { bindActions, back } from '../../reducers/comReducer'
import { staring, resetStar } from '../../reducers/activityReducer'

const pr = 'PR';
const wiki = 'Wiki';
const Code = 'contents';
const Issues = 'issues';
const Insights = 'insights';

export default connect(({ nav, repoInfo, issueInfo, starInfo }) => ({
    nav: nav,
    staredState: starInfo.stared,
    dirs: repoInfo.dirs,
    readme: repoInfo.readme,
    content: repoInfo.content,
    codeRefreshing: repoInfo.getting,
    issuesData: issueInfo.issues,
    issueRefreshing: issueInfo.getting
}), bindActions({ repoContent, clearDir, back, getIssue, errIssue, staring, resetStar }))(
    class extends PureComponent {
        static navigationOptions = ({ navigation }) => {
            const { params } = navigation.state;
            return {
                headerTitle: params && params.name,
                headerTitleStyle: { color: '#ffffff' },
                headerBackTitleStyle: { color: '#ffffff' },
                headerStyle: { backgroundColor: '#333333' },
            }
        };

        constructor(props) {
            super(props);
            const { params } = props.navigation.state;
            this.state = {
                navName: '',
                fullName: params ? params.fullName : '',
                stared: params ? params.stared : false,
            };
            this.navBtns = [
                { name: Code },
                { name: Issues },
                // {name: pr},
                // {name: wiki},
                // {name: Insights},
            ];
        }

        componentDidMount() {
            const { fullName } = this.state;
            if (fullName) {
                // console.log(fullName);
                this.getNavContent(fullName, Code)
            }
        }

        // todo， 如果出现错误信息，返回上一页

        componentWillUnmount() {
            const { clearDir, errIssue, resetStar } = this.props;
            // 清理仓库主页
            clearDir();
            // 清理仓库的问题数据
            errIssue();
            resetStar();
        }

        /**
         * 导航对应的业务逻辑选择
         * @param fullName
         * @param type contents | issues
         * @returns {*}
         */
        getNavContent = (fullName, type) => {
            const { getIssue, repoContent } = this.props;
            const url = '/repos/' + fullName + `/${type}` + getParams({ ref: 'master', page: 1 });
            let press;

            switch (type) {
                case Code:
                    press = () => repoContent({ fullName, type });
                    break;
                case Issues:
                    press = getIssue;
                    break
            }

            if (this.state.navName === type) return null;

            press(url); // 不同按钮之间的切换，才请求数据
            return this.setState({ navName: type })
        };

        refreshController = (isRefreshing) => <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this.onRefreshing}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#0000ff', '#00ff00', '#ff0000',]}
            progressBackgroundColor="#ffffff"
        />;

        renderListHeader = () => {
            const { navName, fullName } = this.state;
            return (
                <View style={styles.navBox}>
                    {
                        this.navBtns.map((item, index) => {
                            const cur = navName === item.name;
                            return (
                                <Button
                                    key={index}
                                    content={<Text
                                        style={{ color: cur ? '#ffffff' : 'rgba(255,255,255,0.7)' }}>{item.name}</Text>}
                                    style={styles.navBtn}
                                    onPress={() => cur ? null : this.getNavContent(fullName, item.name)}/>
                            )
                        })
                    }
                </View>
            )
        };

        /**
         * 下拉刷新
         * @returns {*}
         */
        onRefreshing = () => {
            const { fullName, navName } = this.state;

            return this.getNavContent(fullName, navName)
        };

        /**
         * 渲染目录或者文件
         * @param item 每行元素
         * @returns {XML}
         */
        renderDirOrFile = ({ item }) => {
            const { type, path, name } = item;
            const { navigation } = this.props;
            const isDir = type === 'dir'; // 是否是目录

            // todo 添加分支的请求

            return (
                <TouchableOpacity
                    style={styles.contentRow}
                    onPress={() => isDir
                        ? navigation.navigate('RepoDir', { fullName: this.state.fullName, name, path })
                        : item.name === 'README.md'
                            ? navigation.navigate('Readme', { fullName: this.state.fullName, path, type })
                            : navigation.navigate('RepoFile', { fullName: this.state.fullName, path, type })}>
                    <Icon name={isDir ? 'folder' : 'file'} size={18}
                          style={{ opacity: 0.7 }}/>
                    <Text style={styles.contentName}>{name}</Text>
                </TouchableOpacity>
            )
        };

        /**
         * 渲染问题列表
         * @param item
         * @returns {XML}
         */
        renderIssues = ({ item }) => {
            const { title, user, comments, number } = item;
            const { fullName } = this.state;
            const { navigation } = this.props;

            return (
                <TouchableHighlight onPress={() => navigation.navigate('RepoIssues', { fullName, number, title })}
                                    underlayColor={'rgba(100,100,100 ,0.1)'}>
                    <View style={styles.issueBox}>
                        <View>
                            <Text style={{ color: '#333' }}>{'#' + number}</Text>
                            <Image source={{ uri: user.avatar_url }} style={styles.avatarBox}/>
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
            const { navName, fullName, stared } = this.state;
            let data, header = null, renderItem = () => null, refreshing = false;

            switch (navName) {
                case Code:
                    const { content, codeRefreshing, navigation, staredState, staring } = this.props;
                    let starred = stared || staredState;
                    // todo 分支选择
                    header = () => {
                        if (navigation.state.params.desc) {
                            return (
                                <View style={styles.starWrap}>
                                    <View style={{ flex: 1 }}><Text
                                        style={styles.descText}>{navigation.state.params.desc}</Text></View>
                                    <Button content={<Text>{starred ? 'unstar' : 'star'}</Text>}
                                            icon={<Icon name={'stared'} size={16}/>}
                                            onPress={() => staring(fullName, starred ? 'delete' : 'put')}
                                            style={{
                                                paddingVertical: 2,
                                                paddingHorizontal: 4,
                                                borderWidth: StyleSheet.hairlineWidth,
                                                borderRadius: 2
                                            }}/>
                                </View>
                            )
                        }
                        return null
                    };
                    data = content;
                    renderItem = this.renderDirOrFile;
                    refreshing = codeRefreshing;
                    break;
                case Issues:
                    const { issuesData, issueRefreshing } = this.props;
                    data = issuesData;
                    renderItem = this.renderIssues;
                    refreshing = issueRefreshing;
            }

            if (!data) return <Loading/>;
            return (
                <CList
                    data={data}
                    renderItem={renderItem}
                    ListHeaderComponent={header}
                    refreshControl={this.refreshController(refreshing)}/>
            )
        };

        render() {
            return (
                <View style={styles.wrap}>
                    {this.renderListHeader()}
                    {this.renderNavContainer()}
                </View>
            )
        }
    })

const styles = {
    wrap: { flex: 1, backgroundColor: '#ffffff' },
    starWrap: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 12,
        borderBottomWidth: 1
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
        width: '100%',
        height: 40,
        alignItems: 'center',
        backgroundColor: '#333',
        flexDirection: 'row'
    },
    navBtn: {
        flex: 1,
        height: '100%'
    },
    descText: { marginVertical: 16, marginHorizontal: 12, color: '#333' },
    contentName: { marginLeft: 6, color: '#0366d6' },
    titleText: { fontSize: 16, color: '#333' },
    issueDescBox: { flex: 1, marginHorizontal: 16 },
    avatarBox: { width: 32, height: 32, borderRadius: 16 },
    contentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
    issueBox: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, paddingHorizontal: 16 }
};
