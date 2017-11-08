import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,

    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import {openToast, bindActions, back} from '../../reducers/comReducer'
import {fileContent, popDir, clearDir} from '../../reducers/repoReducer'

export default connect(state => ({
    readme: state.repoInfo.readme,
    dirs: state.repoInfo.dirs,
    nav: state.nav
}), bindActions({fileContent, openToast, popDir, clearDir, back}))(
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
            }
            this.dirIndex = -1 // 栈为空
            this.hasMore = false
        }

        componentWillMount() {
            const {state} = this.props.navigation
            if (state.params) {
                this.props.fileContent({fullName: state.params.fullName, path: state.params.path, type: 'dir'})
            }
        }

        componentDidMount() {

        }

        componentWillReceiveProps(nextProps) {
            const {dirs} = this.props;

            if (dirs.length < nextProps.dirs.length && !this.hasMore) { // 目录栈增加
                this.dirIndex = nextProps.dirs.length - 1
                this.hasMore  = true
            }
        }

        componentWillUnmount() {
            const {dirs} = this.props;
            dirs.pop()
            this.props.popDir(dirs)
        }

        /**
         * 返回每行key
         * @param item 每行元素
         * @param index 每行元素的索引
         */
        keyExtractor = (item, index) => 'dir' + index;

        /**
         * 渲染目录或者文件
         * @param item 每行元素
         * @returns {XML}
         */
        renderDir = ({item}) => {
            const {type, path, name} = item
            const {navigation} = this.props
            const isDir = type === 'dir' // 是否是目录

            // todo 添加分支的请求

            return (
                <TouchableOpacity
                    onPress={() => isDir
                        ? navigation.navigate('RepoDir', {fullName: this.state.fullName, name, path})
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

        render() {
            const {dirs} = this.props;

            if (this.dirIndex < 0) return null

            return (
                <View style={styles.wrap}>
                    <FlatList
                        horizontal={false}
                        data={dirs[this.dirIndex]}
                        style={{width: vw, height: vh}}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.separator}
                        contentContainerStyle={{padding: 14}}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderDir}/>
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
