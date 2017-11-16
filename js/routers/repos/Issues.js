import React, {Component} from 'react'
import {
    View,
    Image,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActions} from '../../reducers/comReducer'

import {getIssueBody, getIssueBodyComments, errIssueComments} from '../../reducers/issueReducer'
import Loading from '../../components/Loading';

export default connect(state => ({
    issueBody: state.issueInfo.issueBody,
    issueComment: state.issueInfo.issueComments
}), bindActions({getIssueBody, getIssueBodyComments, errIssueComments}))(
    class extends Component {
        static navigationOptions = ({navigation}) => {
            const {params} = navigation.state;
            return {
                headerTitle: params && String(params.number)
            }
        };

        constructor(props) {
            super(props);
            const {params} = props.navigation.state;
            this.state = {
                number: params ? params.number : '124',
                fullName: params ? params.fullName : 'crazycodeboy/react-native-splash-screen'
            }
        }

        componentDidMount() {
            const {fullName, number} = this.state;
            const {getIssueBody} = this.props;
            const url = `/repos/${fullName}/issues/${number}`;

            if (fullName) getIssueBody(url)
        }

        componentWillUnmount() {
            // this.props.errIssueComments()
        }

        keyExtractor = (item, index) => 'issueComment' + index;
        /**
         * 行分隔线
         */
        separator = () => <View style={styles.separator}/>;

        renderCommentBody = () => {

            const {issueBody} = this.props
            if (isEmpty(issueBody)) return <View style={styles.empty}><Text>Loading</Text></View>

            const {user, body, updated_at} = issueBody

            return (
                <View style={styles.commentBox}>
                    <Image source={{uri: user.avatar_url}} style={styles.commentAvatar}/>
                    <View style={{flex: 1, marginHorizontal: 12}}>
                        <Text style={[styles.commentText, {}]}>{"<-- " + user.login + ' --> ' + updated_at}</Text>
                        <Text style={[styles.commentText, {fontSize: 14, marginVertical: 6}]}>{body}</Text>
                    </View>
                </View>
            )
        }

        renderComment = ({item}) => {
            if (!item) return <View style={styles.empty}><Text>Loading</Text></View>
            const {user, body, updated_at} = item;

            return (
                <View style={styles.commentBox}>
                    <Image source={{uri: user.avatar_url}} style={styles.commentAvatar}/>
                    <View style={{flex: 1, marginHorizontal: 12}}>
                        <Text style={styles.commentText}>{"<-- " + user.login + ' --> ' + updated_at}</Text>
                        <Text style={[styles.commentText, {fontSize: 14, marginVertical: 6}]}>{body}</Text>
                    </View>
                </View>
            )
        };

        render() {
            const {issueComment} = this.props;

            if (isEmpty(issueComment)) return <Loading/>

            return (
                <View style={{flex: 1}}>
                    <FlatList
                        ListHeaderComponent={this.renderCommentBody}
                        data={issueComment}
                        keyExtractor={this.keyExtractor}
                        ItemSeparatorComponent={this.separator}
                        ListEmptyComponent={() => <View style={styles.empty}><Text>None</Text></View>}
                        renderItem={this.renderComment}/>
                </View>
            )
        }
    }
)

const styles = StyleSheet.create({
    commentBox: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff'
    },
    commentAvatar: {width: 32, height: 32, borderRadius: 16},
    commentText: {fontSize: 12, color: '#333'},
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    },
    empty: {height: dp(250), justifyContent: 'center', alignItems: 'center'}
});
