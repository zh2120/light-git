import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/Octicons'
import {Button, Loading, CList} from '../../components/index'
import {bindActions} from '../../reducers/comReducer'
import {getRepoList} from '../../reducers/userReducer'

export default connect(({userInfo}) => ({
    publicPros: userInfo.public_repos,
    proList: userInfo.proList,
}), bindActions({getRepoList}))(
    class extends Component {
        static navigationOptions = ({headerTitle: 'Repositories'});

        constructor(props) {
            super(props);
            this.state = {};
        }

        componentDidMount() {
            const {getRepoList} = this.props;
            getRepoList({username: ''})
        }

        /**
         * 渲染用户仓库的单个项目
         * @param pro 单个项目
         * @returns {XML}
         */
        IconProps = {
            size: 18,
            style: {width: 32, marginVertical: 4, color: 'rgb(240,130,132)'}
        };
        renderProItem = ({item}) => {
            const {full_name, name, description, language, stargazers_count, fork} = item;
            const {navigation} = this.props;
            const proItem = (
                <View style={{flexDirection: 'row'}}>
                    {
                        fork
                            ? <Octicons name={'repo-forked'} {...this.IconProps}/>
                            : <Feather name={'codepen'} {...this.IconProps}/>
                    }

                    <View>
                        <Text style={{color: '#0366d6', fontSize: 16, marginBottom: 4}}>{name}</Text>
                        {
                            description
                                ? <Text style={{marginVertical: 8}}>{description}</Text>
                                : null
                        }
                        <View style={{flexDirection: 'row', marginVertical: 4}}>
                            {
                                language
                                    ? <Text style={{color: '#333', marginRight: 12}}>{language}</Text>
                                    : null
                            }
                            <Text>{' 🌟 ' + stargazers_count}</Text>
                        </View>
                    </View>
                </View>
            );
            return (
                <Button content={proItem}
                        style={styles.btnRow}
                        onPress={() => navigation.navigate('RepoHome', {fullName: full_name, name: name})}/>
            )
        };

        render() {
            const {proList} = this.props;
            if (!proList) {
                return <View style={{height: dp(250)}}><Loading/></View>
            }

            return (
                <CList
                    style={styles.wrap}
                    data={proList}
                    renderItem={this.renderProItem}/>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff'
    },
    btnRow: {
        alignItems: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8
    }
});
