import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    WebView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    PanResponder
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import {Button, marked, html} from '../../components'
import {bindActions} from '../../actions/'
import {openToast} from '../../actions/common'
import {repoContent, fileContent, popDir, clearDir} from '../../actions/repo'

class RepoHome extends Component {
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
        // repoContent({fullName: 'zh2120/light-git'})
    }

    componentWillReceiveProps(nextProps) {
        const {dirs} = this.props;

        if (dirs.length < nextProps.dirs.length) { // 目录栈增加
            this.viewScrollTo(nextProps.dirs.length) // 执行滚动
        }
    }

    componentWillUnmount() {
        this.props.clearDir()
    }

    /**
     * 返回每行key
     * @param item 每行元素
     * @param index 每行元素的索引
     */
    keyExtractor = (item, index) => 'dirORFile' + index;

    /**
     * 横向滚动
     * @param dirsLen
     * @returns {*}
     */
    viewScrollTo = (dirsLen) => {
        if (this.index < dirsLen) { // 滚动距离不能超过目录栈的长度
            ++this.index;
            return this.scroll.scrollTo({x: this.layoutWidth * this.index, y: 0, animated: true})
        } else {
            console.log('没有滚动')
        }
    };

    /**
     * 渲染目录或者文件
     * @param item 每行元素
     * @returns {XML}
     */
    renderDirOrFile = ({item}) => {
        const {type, sha, path, name} = item
        const {openToast, navigation, fileContent} = this.props
        const isDir = type === 'dir' // 是否是目录

        // todo 添加分支的请求

        return (
            <TouchableOpacity
                onPress={() => isDir
                    ? fileContent({fullName: this.state.fullName, path, type})
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
                    style={styles.starButton}/>
            <Button icon={<Octicons name={'star'} size={18}/>}
                    content={<Text>Unstar: 232</Text>}
                    style={styles.starButton}/>
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

    /**
     * 返回上一级目录相关
     * @param nativeEvent
     */
    onMomentumScrollEnd = ({nativeEvent}) => {
        const {popDir, dirs} = this.props;
        const {x} = nativeEvent.contentOffset;

        if (this.moment > x) { // 上次的偏移量大于当前，返回
            --this.index
            dirs.pop(); // 抛弃最后一个目录的内容
            popDir(dirs) // 删除最后状态，返回新的目录栈
        }

        this.moment = x // 保留当前偏移量
    };

    /**
     * 布局
     * @param nativeEvent
     */
    onLayout = ({nativeEvent}) => {
        this.index = 0;  // 当前索引
        this.moment = 0; // 滚动速度，
        this.layoutWidth = nativeEvent.layout.width // 横向滚动宽度
    };

    renderDirStack = () => {
        const {dirs} = this.props;

        return dirs.map((item, index) =>
            <FlatList key={index}
                      data={item}
                      horizontal={false}
                      style={{width: vw, height: vh}}
                      showsVerticalScrollIndicator={false}
                      ItemSeparatorComponent={this.separator}
                      contentContainerStyle={{padding: 14}}
                      keyExtractor={this.keyExtractor}
                      renderItem={this.renderDirOrFile}
            />
        )
    }

    render() {
        const {content} = this.props;

        return (
            <View style={styles.wrap}>
                <ScrollView
                    ref={view => this.scroll = view}
                    pagingEnabled={true}
                    horizontal={true}
                    bounces={false}
                    bouncesZoom={false}
                    directionalLockEnabled={true}
                    onLayout={this.onLayout}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}>
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
                    {
                        this.renderDirStack()
                    }
                </ScrollView>
            </View>
        )
    }
}

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

export default connect(state => ({
    content: state.repoContent.content,
    readme: state.repoFile.readme,
    dirs: state.repoFile.dirs
}), bindActions({repoContent, fileContent, openToast, popDir, clearDir}))(RepoHome)
