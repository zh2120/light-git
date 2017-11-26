import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Button, Loading} from '../../components/'
import {bindActions, openToast} from '../../reducers/comReducer'
import {searchRepo} from '../../reducers/searchReducer'

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
    searchIcon: {color: '#000', marginHorizontal: 5, alignItems: 'center'},
    cancel: {width: 54, height: 44, alignItems: 'center', justifyContent: 'center'}
});

const SearchHeader = connect(state => ({}), bindActions({searchRepo, openToast}))(
    class extends Component {
        constructor(props) {
            super(props);
            const {params} = props.navigation.state;
            this.state = {searchText: params ? params.searchText : ''}
        }

        componentDidMount() {
            const {searchText} = this.state;

            if (searchText) {
                this.searchSubmit(searchText)
            }
        }

        changeText = (text) => this.setState({searchText: text});

        searchSubmit = (searchText) => {
            const {searchRepo, openToast} = this.props;
            const params = {
                q: searchText.replace(/^\s+|\s+$/g, ''),
                sort: 'star'
            };
            if (params.q.length > 0) {
                const url = '/search/repositories' + getParams(params);

                return searchRepo({name: searchText, url});
            }
            return openToast('Input Content')

        }; // 当前页面递交搜索内容

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
                            autoFocus={true}
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
                    <Button style={searchStyles.cancel}
                            content={<Text style={{color: '#fff'}}>cancel</Text>}
                            onPress={() => navigation.goBack()}/>
                </View>
            )
        }
    }
);


export default connect(({searchInfo}) => ({
    repos: searchInfo.repos,
    history: searchInfo.history,
    searching: searchInfo.searching
}), bindActions({searchRepo}))(
    class extends Component {
        static navigationOptions = ({navigation}) => ({header: <SearchHeader navigation={navigation}/>});

        constructor(props) {
            super(props);
            this.state = {
                recordOpen: false
            }
        }

        reSearch = (item) => this.setState(pre => {
            this.props.searchRepo(item);

            return {recordOpen: !pre}
        });

        renderSectionHeader = ({section}) => { // 分段头
            let title, leftIconName, rightIconName, clear;
            const {recordOpen} = this.state;

            if (section.type === 'history') {
                title = 'History';
                leftIconName = 'tag';
                rightIconName = recordOpen ? 'chevron-double-up' : 'chevron-double-down';
                clear = () => this.setState({recordOpen: !recordOpen})
            }
            if (section.type === 'repos') {
                title = 'Results';
                leftIconName = 'paperclip';
                rightIconName = 'broom';
                clear = () => null
            }


            return (
                <View style={[styles.sectionBase, styles.sectionWrap]}>
                    <View style={styles.sectionBase}>
                        <EvilIcons name={leftIconName} size={28}/>
                        <Text style={{marginRight: 12}}>{title}</Text>
                    </View>
                    <TouchableOpacity onPress={clear}>
                        <View style={styles.sectionBase}>
                            <MaterialCommunityIcons name={rightIconName} size={24}/>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        };

        renderHistoryItem = ({item, index}) => { // 历史记录单项
            if (item) {
                return (
                    <TouchableHighlight underlayColor={'rgba(100,100,100 ,0.1)'}
                                        onPress={() => this.reSearch(item)} key={`h-${index}`}>
                        <View style={styles.touchItem}>
                            <View style={styles.touchItemLeft}>
                                <EvilIcons name={'search'} size={22} style={{color: '#0366d6'}}/>
                                <Text style={styles.touchItemText}>{item.name}</Text>
                            </View>
                            <EvilIcons name={'redo'} size={24} style={{marginRight: 2}}/>
                        </View>
                    </TouchableHighlight>
                )
            }
            return (
                <View style={styles.touchItem}>
                    <Text style={styles.touchItemText}>暂时还么有历史呢</Text>
                </View>
            )
        };

        renderReposItem = ({item, index}) => {
            if (!item) return null;
            const {
                name,
                full_name,
                language,
                updated_at,
                description,
                stargazers_count,
            } = item;
            const {navigation} = this.props;

            return (
                <TouchableHighlight
                    key={`r-${index}`}
                    underlayColor={'rgba(100,100,100 ,0.1)'}
                    onPress={() => navigation.navigate('RepoHome', {fullName: full_name, name: name})}>
                    <View style={styles.repoItem}>
                        <View style={styles.touchItemLeft}>
                            <Ionicons name={'ios-browsers-outline'} size={22}
                                      style={{color: '#0366d6', marginRight: 10}}/>
                            <Text style={styles.repoName}>{full_name}</Text>
                        </View>
                        <View style={styles.touchItemLeft}>
                            <Octicons name={'star'} size={18} style={{marginLeft: 6}}/>
                            <Text>{stargazers_count}</Text>
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

        };

        keyExtractor = (item, index) => 'key-' + index;

        render() {
            const {recordOpen} = this.state;
            const {repos, history, searching} = this.props;
            const effectiveHiStory = recordOpen ? history : []; // 可用的历史，隐藏或者展示

            return (
                <View style={{backgroundColor: '#fff', flex: 1,}}>
                    {
                        searching
                            ? <Loading name={'cursor'}/>
                            : <SectionList
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
                                ]}/>
                    }
                </View>
            )
        }
    }
)

const styles = StyleSheet.create({
    sectionBase: {height: 36, flexDirection: 'row', alignItems: 'center'},
    sectionWrap: {
        paddingTop: 10,
        paddingBottom: 14,
        paddingHorizontal: 12,
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
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    touchItemLeft: {flexDirection: 'row', alignItems: 'center'},
    touchItemRight: {backgroundColor: 'red', width: 100, paddingRight: 6},
    touchItemText: {color: '#0366d6', fontSize: 16, paddingLeft: 6},
    repoItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginVertical: 4,
    },
    repoName: {color: '#0366d6', fontSize: 18},
    repoDesc: {marginVertical: 8, marginLeft: 24, paddingVertical: 12},
    repoDescText: {fontSize: 16}
});
