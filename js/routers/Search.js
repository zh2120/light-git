import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import {bindActions} from '../actions'
import {searchRepo, saveHistory} from '../actions/search'

const searchStyles = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        height: 64,
        paddingTop: 24,
        paddingHorizontal: 8,
        alignItems: 'center',
        backgroundColor: 'rgba(30,144,255,0.6)'
    },
    searchWrap: {
        flex: 1,
        height: 30,
        borderRadius: 2,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    textInput: {flex: 1, padding: 0, marginHorizontal: 4},
    searchIcon: {color: '#000', marginHorizontal: 5, alignItems: 'center'}
});

const SearchHeader = connect(state => ({}), bindActions({searchRepo, saveHistory}))(
    class SearchHeader extends Component {
        constructor(props) {
            super(props);
            this.state = {searchText: ''}
        }

        componentDidMount() {
            const {navigation, searchRepo} = this.props;

            if (navigation.state.params) {
                this.setState({searchText: navigation.state.params.searchText});

                searchRepo(navigation.state.params.searchText)
            }
        }

        changeText = (text) => this.setState({searchText: text});

        searchSubmit = (searchText) => this.props.searchRepo(searchText); // 当前页面递交搜索内容

        render() {
            const {searchText} = this.state;
            const {navigation} = this.props;

            return (
                <View style={searchStyles.wrap}>
                    <View style={searchStyles.searchWrap}>
                        <TouchableOpacity
                            onPress={() => this.searchSubmit(searchText)}>
                            <EvilIcons name={'search'} size={24} style={searchStyles.searchIcon}/>
                        </TouchableOpacity>
                        <TextInput
                            value={searchText}
                            placeholder="Search Github"
                            selectionColor={'#000'}
                            autoCapitalize="none"
                            onChangeText={this.changeText}
                            style={searchStyles.textInput}
                            underlineColorAndroid={'transparent'}
                            onSubmitEditing={() => this.searchSubmit(searchText)}/>
                        {
                            searchText ? (
                                <TouchableOpacity
                                    onPress={() => this.setState({searchText: ''})}>
                                    <EvilIcons size={22} name={'close-o'} style={{marginRight: 8}}/>
                                </TouchableOpacity>
                            ) : null
                        }
                    </View>
                    <TouchableOpacity
                        style={{width: 54, height: 44, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => navigation.goBack()}>
                        <Text style={{color: '#fff'}}>cancel</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
);

const styles = StyleSheet.create({
    sectionBase: {height: 36, flexDirection: 'row', alignItems: 'center'},
    sectionWrap: {
        paddingTop: 10,
        paddingBottom: 14,
        marginBottom: 8,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderBottomColor: 'rgba(10,10,10, 0.6)',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    },
    touchItem: {
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    touchItemLeft: {flexDirection: 'row', alignItems: 'center'},
    touchItemRight: {backgroundColor: 'red', width: 100, paddingRight: 6},
    touchItemText: {color: '#0366d6', fontSize: 16, paddingLeft: 6},
    repoItem: {
        paddingVertical: 16,
        paddingHorizontal: 6,
        marginVertical: 4,
    },
    repoName: {color: '#0366d6', fontSize: 18},
    repoDesc: {marginVertical: 8, marginLeft: 24, paddingVertical: 12},
    repoDescText: {fontSize: 16}
});

class Search extends Component {
    static navigationOptions = ({navigation}) => ({header: <SearchHeader navigation={navigation}/>});

    constructor(props) {
        super(props);
        this.state = {
            recordOpen: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const {searching} = this.props;

        if (searching !== nextProps.searching) {

        }
    }

    renderHistoryItem = ({item, index}) => { // 历史记录单项
        if (item) {
            return (
                <TouchableHighlight underlayColor={'rgba(100,100,100 ,0.1)'}
                                    onPress={() => this.props.searchRepo(item)} key={`h-${index}`}>
                    <View style={styles.touchItem}>
                        <View style={styles.touchItemLeft}>
                            <EvilIcons name={'search'} size={22} style={{color: '#0366d6'}}/>
                            <Text style={styles.touchItemText}>{item}</Text>
                        </View>
                        <EvilIcons name={'redo'} size={24} style={{marginRight: 2}}/>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    renderReposItem = ({item, index}) => {
        if (item) {
            const {
                id,
                name,
                score,
                owner,
                forks,
                git_url,
                full_name,
                language,
                homepage,
                html_url,
                open_issues,
                watchers,
                updated_at,
                clone_url,
                description,
                stargazers_count,
            } = item;
            const {navigation} = this.props

            return (
                <TouchableHighlight key={`r-${index}`}
                                    underlayColor={'rgba(100,100,100 ,0.1)'}
                                    onPress={() => navigation.navigate('RepoHome', {fullName: full_name, name: name})}>
                    <View style={styles.repoItem}>
                        <View style={[styles.touchItemLeft, {justifyContent: 'space-between'}]}>
                            <View style={styles.touchItemLeft}>
                                <Ionicons name={'ios-browsers-outline'} size={22}
                                          style={{color: '#0366d6', marginRight: 10}}/>
                                <Text style={styles.repoName}>{full_name}</Text>
                            </View>
                            <View style={styles.touchItemLeft}>
                                <Text>{stargazers_count}</Text>
                                <Octicons name={'star'} size={18} style={{marginLeft: 6}}/>
                            </View>
                        </View>
                        <View style={styles.repoDesc}><Text style={styles.repoDescText}>{description}</Text></View>
                        <View style={[styles.touchItemLeft, {justifyContent: 'space-between'}]}>
                            {
                                language ? (
                                    <Text style={{
                                        backgroundColor: '#e7f3ff',
                                        padding: 4,
                                        color: '#0366d6'
                                    }}>{language}</Text>
                                ) : <View/>
                            }
                            <Text>Updated {updated_at}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }

    };

    renderSectionHeader = ({section}) => { // 分段头
        let title, leftIconName, rightIconName, clear;
        const {recordOpen} = this.state;

        if (section.type === 'history') {
            title = 'History';
            leftIconName = 'tag';
            rightIconName = recordOpen ? 'chevron-double-up' : 'chevron-double-down';
            clear = () => this.setState(pre => ({recordOpen: !pre.recordOpen}))
        } else if (section.type === 'repos') {
            title = 'Results';
            leftIconName = 'paperclip';
            rightIconName = 'broom';
            clear = () => {
            }
        }

        if (section.data.length === 0 && section.type === 'repos') return null; // 仓库为空，隐藏

        return (
            <View style={[styles.sectionBase, styles.sectionWrap]}>
                <View style={styles.sectionBase}>
                    <EvilIcons name={leftIconName} size={28}/>
                    <Text style={{marginRight: 12}}>{title}</Text>
                    {
                        section.type === 'repos' ? (
                            <ActivityIndicator animating={this.props.searching} color={'rgb(30,144,255)'}/>) : null
                    }
                </View>
                <TouchableOpacity onPress={clear}>
                    <View style={styles.sectionBase}>
                        <MaterialCommunityIcons name={rightIconName} size={24}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    keyExtractor = (item, index) => 'key-' + index;

    render() {
        const {recordOpen} = this.state;
        const {repos, history} = this.props;
        const effectiveHiStory = recordOpen ? history : []; // 可用的历史，隐藏或者展示

        return (
            <View style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 10,}}>
                <SectionList
                    ItemSeparatorComponent={() => (<View style={styles.separator}/>)}
                    showsVerticalScrollIndicator={false}
                    style={{marginTop: 16}}
                    stickySectionHeadersEnabled={true}
                    renderSectionHeader={this.renderSectionHeader}
                    keyExtractor={this.keyExtractor}
                    ListEmptyComponent={<View><Text>暂无数据</Text></View>}
                    sections={[ // 不同section渲染不同类型的子组件
                        {data: effectiveHiStory, renderItem: this.renderHistoryItem, type: 'history'},
                        {data: repos, renderItem: this.renderReposItem, type: 'repos'},
                    ]}
                />
            </View>
        )
    }
}

const bindState = state => ({
    repos: state.reposInfo.repos,
    history: state.reposInfo.history,
    searching: state.reposInfo.searching
});

export default connect(bindState, bindActions({searchRepo}))(Search)
