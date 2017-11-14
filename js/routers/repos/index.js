import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import {Button, Loading} from '../../components'
import {repoContent, clearDir} from '../../reducers/repoReducer'
import {getIssue} from '../../reducers/issueReducer'
import {openActionSheet, bindActions, back} from '../../reducers/comReducer'

const pr = 'PR';
const wiki = 'Wiki';
const Code = 'contents';
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
                navName: Issues,
                isRefreshing: false,
                fullName: params ? params.fullName : ''
            }
            this.hasMore = false
            this.navBtns = [
                {name: Code},
                {name: Issues},
                // {name: pr},
                // {name: wiki},
                // {name: Insights},
            ]

            /**
             * 列表通用属性
             */
            this.listProps = {
                horizontal: false,
                keyExtractor: this.keyExtractor,
                refreshControl: <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefreshing}
                    tintColor="#ff0000"
                    title="Loading..."
                    titleColor="#00ff00"
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                    progressBackgroundColor="#ffff00"
                />,
                showsVerticalScrollIndicator: false,
                ItemSeparatorComponent: this.separator,
                contentContainerStyle: {paddingVertical: 14},
                ListEmptyComponent: () => <View style={{height: dp(250)}}><Loading/></View>
            };
        }

        componentDidMount() {
            const {fullName, navName} = this.state

            if (fullName) {
                console.log(0)
                this.getNavContent(fullName, navName)
            }
        }


        componentWillUnmount() {
            // todo 清理仓库主页
            this.props.clearDir()
        }

        /**
         *
         * @param fullName
         * @param type contents | issues
         * @returns {*}
         */
        getNavContent = (fullName, type) => {
            const {getIssue, repoContent} = this.props
            const url = '/repos/' + fullName + `/${type}` + getParams({ref: 'master', page: 1})
            let press

            switch (type) {
                case Code:
                    press = repoContent;
                    break
                case Issues:
                    press = getIssue;
                    break
            }
            return this.setState((pre) => {
                press(url)
                if (pre.navName === type) return;

                return {navName: type}
            })
        }

        /**
         * 返回每行key
         * @param item 每行元素
         * @param index 每行元素的索引
         */
        keyExtractor = (item, index) => 'dirORFile' + index;

        /**
         * 行分隔线
         */
        separator = () => <View style={styles.separator}/>;

        /**
         * 渲染导航栏
         * @returns {Array} 导航按钮组
         */
        renderNav = () => {
            const {navName, fullName} = this.state
            console.log(4)
            return this.navBtns.map((item, index) => {
                const cur = navName === item.name
                return (
                    <Button
                        key={index}
                        content={<Text style={{color: cur ? '#e36209' : '#333'}}>{item.name}</Text>}
                        style={styles.navBtn}
                        onPress={() => cur ? null : this.getNavContent(fullName, item.name)}/>
                )
            })
        }

        onRefreshing = () => {
            const {fullName, navName, isRefreshing} = this.state

            // return !isRefreshing && this.setState((pre) => {
            // this.getNavContent(fullName, navName)
            //     return {isRefreshing: !pre.isRefreshing}
            // })
        }

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
         * 渲染问题列表
         * @param item
         * @returns {XML}
         */
        renderIssues = ({item}) => {
            const {title, user, comments} = item

            return (
                <TouchableHighlight onPress={() => {
                }} underlayColor={'rgba(100,100,100 ,0.1)'}>
                    <View style={styles.issueBox}>
                        <Image source={{uri: user.avatar_url}} style={styles.avatarBox}/>
                        <View style={styles.issueDescBox}>
                            <Text style={styles.titleText}>{title}</Text>
                        </View>
                        <Text style={styles.titleText}>{comments}</Text>
                    </View>
                </TouchableHighlight>
            )
        }

        /**
         * 渲染导航对应的内容
         * @returns {XML}
         */
        renderNavContainer = () => {
            const {navName} = this.state

            switch (navName) {
                case Code:
                    const {content} = this.props;
                    return (
                        <FlatList
                            data={content}
                            renderItem={this.renderDirOrFile}
                            {...this.listProps}/>
                    );
                case Issues:
                    const {issuesData} = this.props

                    return (
                        <FlatList
                            data={issuesData}
                            renderItem={this.renderIssues}
                            {...this.listProps}/>
                    );
                default :
                    return;
            }
        }

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
    contentRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16},
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    },
    contentName: {marginLeft: 6},
    issueBox: {flexDirection: 'row', alignItems: 'flex-start', height: 72, marginTop: 10, paddingHorizontal: 16},
    avatarBox: {width: 32, height: 32, borderRadius: 16},
    titleText: {fontSize: 16, color: '#333'},
    issueDescBox: {flex: 1, marginHorizontal: 16}
};
