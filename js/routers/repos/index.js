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
import {repoContent} from '../../actions/repo'

class RepoHome extends Component {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        return {
            headerTitle: params && params.name || 'light-git'
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        const {repoContent, navigation} = this.props
        // console.log(navigation)
        if (navigation.state.params) {
            // repoContent(navigation.state.params.fullName)
        }
        // console.log(this.scroll)
        // repoContent({fullName: 'facebook/react'})
    }

    componentWillUnmount() {
    }

    /**
     * 返回每行key
     * @param item 每行元素
     * @param index 每行元素的索引
     */
    keyExtractor = (item, index) => 'dirORFile' + index;

    viewScrollTo = () => {
        console.log('index-> ', this.index)
        const {dirs} = this.props
        this.index ++ // 点击目录请求数据，加载新的子目录
        if (this.index > 2) return null
        const nextX = this.layoutWidth * this.index
        return this.scroll.scrollTo({x: nextX, y: 0, animated: true})
    }

    /**
     * 渲染目录或者文件
     * @param item 每行元素
     * @returns {XML}
     */
    renderDirOrFile = ({item}) => {
        const {type, sha, path, name} = item
        const {openToast, navigation} = this.props
        const isDir = type === 'dir' // 是否是目录

        return (
            <TouchableOpacity
                onPress={() => isDir ? this.viewScrollTo() : navigation.navigate('RepoFile', {path, name})}>
                <View style={styles.contentRow}>
                    <Octicons name={isDir ? 'file-directory' : 'file'} size={24} style={{color: '#888'}}/>
                    <Text style={styles.contentName}>
                        {name}
                    </Text>
                </View>
            </TouchableOpacity>

        )
    }

    /**
     * 行分隔线
     */
    separator = () => <View style={styles.separator}/>

    /**
     * 库头的多按钮
     */
    repoHeader = () =>
        <View style={styles.starWrap}>
            <Button icon={<Octicons name={'triangle-down'} size={18}/>}
                    content={<Text>Branch: master</Text>}
                    style={styles.starButton}/>
            <Button icon={<Octicons name={'star'} size={18}/>}
                    content={<Text>Unstar: 232</Text>}
                    style={styles.starButton}/>
        </View>

    repoFooter = () => {
        const {file} = this.props
        const h5 = html(marked(atob(file.content))) // markdown 转 html

        return (
            <View style={{width: vw, height: vh, borderTopWidth: 1}}>
                <WebView
                    style={{width: vw, height: vh}}
                    scalesPageToFit={true}
                    source={{html: h5}}/>
            </View>
        )
    }

    scrollEnd = ({nativeEvent}) => {

        const {x} = nativeEvent.contentOffset
        if (this.moment > x) { // 上次的偏移量大于当前，返回
            this.index--
        }
        this.moment = x
        console.log(this.index, nativeEvent)
        console.log('end')
    }

    onLayout = ({nativeEvent}) => {
        this.index = 0
        this.moment = 0 // 滚动速度，
        this.layoutWidth = nativeEvent.layout.width
    }

    render() {

        const {content} = this.props
        const dirTree = <FlatList
            horizontal={false}
            style={{
                width: vw,
                height: vh,
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.separator}
            contentContainerStyle={{padding: 14}}
            data={content}
            ListHeaderComponent={this.repoHeader}
            ListFooterComponent={this.repoFooter}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderDirOrFile}/>

        const dirTree1 = <FlatList
            horizontal={false}
            style={{
                width: vw,
                height: vh,
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.separator}
            contentContainerStyle={{padding: 14}}
            data={content}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderDirOrFile}/>

        return (
            <View style={styles.wrap}>
                <ScrollView

                    onLayout={this.onLayout}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.scrollEnd}
                    pagingEnabled={true}
                    ref={view => this.scroll = view}
                    bounces={false}
                    bouncesZoom={false}
                    directionalLockEnabled={true}
                    horizontal={true}>
                    {
                        dirTree
                    }
                    {
                        dirTree1
                    }
                    {
                        dirTree1
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
})

export default connect(state => ({
    content: state.repoContent.content,
    file: state.repoFile.file
}), bindActions({repoContent, openToast}))(RepoHome)
