import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Button, Loading, CList} from '../../components/index'
import {bindActions} from '../../reducers/comReducer'
import {getStars, getStarCount} from '../../reducers/activityReducer'

export default connect(({starInfo}) => ({
    count: starInfo.count,
    stars: starInfo.stars,
}), bindActions({getStars, getStarCount}))(
    class extends PureComponent {
        static navigationOptions = ({headerTitle: 'Stars'});

        constructor(props) {
            super(props);
            const {params} = props.navigation.state;
            this.state = {
                username: params ? params.username : ''
            };
            this.page = 1
        }

        componentWillMount() {
            this.props.getStarCount(this.state.username)
        }

        componentDidMount() {
            this.props.getStars({username: this.state.username, page: this.page})
        }

        navigate = (routeName, params) => this.props.navigation.navigate(routeName, params);

        renderStarsItem = ({item}) => {
            const {full_name, name, description, language, stargazers_count} = item;
            const proItem = (
                <View style={{flexDirection: 'row'}}>
                    <Ionicons name={'ios-browsers-outline'} size={22}
                              style={{color: '#0366d6', marginRight: 10}}/>

                    <View>
                        <Text style={{color: '#0366d6', fontSize: 16, marginBottom: 4}}>{name}</Text>
                        {
                            description
                                ? <Text style={{marginVertical: 8, marginRight: 12}}>{description}</Text>
                                : null
                        }
                        <View style={{flexDirection: 'row', marginVertical: 4}}>
                            <Text style={{color: '#333', marginRight: 12}}>{' 🌟 ' + stargazers_count}</Text>
                            {
                                language
                                    ? <Text>{language}</Text>
                                    : null
                            }
                        </View>
                    </View>
                </View>
            );
            return (
                <Button content={proItem}
                        style={styles.btnRow}
                        onPress={() => this.navigate('RepoHome', {fullName: full_name, name: name})}/>
            )
        };

        /**
         * 加载更多
         */
        getMore = () => {
            const {getStars, count} = this.props;
            this.page++;

            if (this.page <= count / 30 + 1) {
                getStars({username: this.state.username, page: this.page})
            }
        };

        render() {
            const {stars} = this.props;
            if (!stars) {
                return <View style={{height: dp(250)}}><Loading/></View>
            }

            return (
                <CList
                    contentContainerStyle={styles.wrap}
                    data={stars}
                    onEndReachedThreshold={10}
                    onEndReached={this.getMore}
                    renderItem={this.renderStarsItem}/>
            )
        }
    }
)

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: '#fff'
    },
    btnRow: {
        alignItems: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8
    }
});
