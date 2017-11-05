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
import {Button, marked, html} from '../../components'
import {bindActions, back} from '../../actions/'
import {openToast, openActionSheet} from '../../actions/common'
import {repoContent, fileContent, popDir, clearDir} from '../../actions/repo'

export default connect(state => ({
    content: state.repoContent.content,
    readme: state.repoFile.readme,
    dirs: state.repoFile.dirs,
    nav: state.nav
}), bindActions({repoContent, fileContent, openToast, popDir, clearDir, back, openActionSheet}))(
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
                fullName: params ? params.fullName : ''
            }
        }

        componentWillMount() {
        }

        componentDidMount() {
            const {fullName} = this.state
            const {repoContent} = this.props;

            if (fullName) {
                repoContent({fullName})
            }
        }

        componentWillReceiveProps(nextProps) {
            const {dirs, navigation} = this.props;

            if (dirs.length === 0 && nextProps.dirs.length === 1) { // 目录栈，刚入栈一个
                navigation.navigate('RepoDir', {fullName: this.state.fullName, name: this.nextDirName})
            }
        }

        componentWillUnmount() {
            // todo 清理仓库主页
            this.props.clearDir()
        }

        /**
         * 返回每行key
         * @param item 每行元素
         * @param index 每行元素的索引
         */
        keyExtractor = (item, index) => 'dirORFile' + index;

        getDir = ({fullName, path, name}) => { // 请求目录，获取到目录数据，再进行跳转
            const {fileContent} = this.props
            this.nextDirName = name

            return fileContent({fullName, path, type: 'dir'})
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
                        ? this.getDir({fullName: this.state.fullName, path, name})
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

        /**
         * 列表头
         */
        repoHeader = () =>
            <View style={styles.starWrap}>
                <Button icon={<Octicons name={'triangle-down'} size={18}/>}
                        content={<Text>Branch: master</Text>}
                        style={styles.starButton} onPress={this.props.openActionSheet}/>
                <Button icon={<Octicons name={'star'} size={18}/>}
                        content={<Text>Unstar: 232</Text>}
                        style={styles.starButton} onPress={() => this.props.openToast('sss')}/>
            </View>;

        /**
         * 列表尾部，展示仓库的markdown说明
         */
        repoFooter = () => {
            const {readme} = this.props;

            if (isEmpty(readme)) return null;

            const h5 = html(marked(readme)) // markdown 转 html

            return (
                <View style={{width: vw, height: vh, borderTopWidth: 1}}>
                    <WebView
                        style={{width: vw, height: vh}}
                        scalesPageToFit={true}
                        source={{html: h5}}/>
                </View>
            )
        };

        render() {
            const {content} = this.props;

            return (
                <View style={styles.wrap}>
                    <FlatList
                        horizontal={false}
                        data={content}
                        style={{width: vw, height: vh}}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.separator}
                        contentContainerStyle={{padding: 14}}
                        ListHeaderComponent={this.repoHeader}
                        ListFooterComponent={this.repoFooter}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderDirOrFile}/>
                </View>
            )
        }
    })

const styles = StyleSheet.create({
    wrap: {flex: 1, backgroundColor: '#fff'},
    starWrap: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginVertical: 12
    },
    starButton: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 2,
        borderWidth: StyleSheet.hairlineWidth
    },
    contentRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4},
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    },
    contentName: {marginLeft: 6}
});
