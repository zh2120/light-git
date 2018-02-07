import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActions } from '../../reducers/comReducer'

import { getIssueBody, getIssueBodyComments, errIssueComments } from '../../reducers/issueReducer'
import { Loading, CList } from '../../components';

export default connect(({ issueInfo }) => ({
    issueBody: issueInfo.issueBody,
    issueComment: issueInfo.issueComments
}), bindActions({ getIssueBody, getIssueBodyComments, errIssueComments }))(
    class extends Component {
        static navigationOptions = ({ navigation }) => {
            const { params } = navigation.state;
            return { headerTitle: params && String('#' + params.number + ' ' + params.title) }
        };

        constructor(props) {
            super(props);
            const { params } = props.navigation.state;
            this.state = {
                number: params ? params.number : '',
                fullName: params ? params.fullName : ''
            }
        }

        componentDidMount() {
            const { fullName, number } = this.state;
            const { getIssueBody } = this.props;
            const url = `/repos/${fullName}/issues/${number}`;

            if (fullName) getIssueBody(url)
        }

        componentWillUnmount() {
            this.props.errIssueComments()
        }

        /**
         * 渲染评论
         * @param item
         * @returns {*}
         */
        renderComment = ({ item }) => {
            if (!item) return null;
            const { user, body, updated_at } = item;

            return (
                <View style={styles.commentBox}>
                    <Image source={{ uri: user.avatar_url }} style={styles.commentAvatar}/>
                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.commentText}>{"<-- " + user.login + ' --> '}</Text>
                            <Text style={styles.commentText}>{updated_at}</Text>
                        </View>
                        <Text style={[styles.commentText, { fontSize: 14, marginVertical: 10 }]}>{body}</Text>
                    </View>
                </View>
            )
        };

        /**
         * 整合评论主体和回复
         * @returns {null}
         */
        renderIssues = () => {
            const { issueBody, issueComment } = this.props;
            if (!Array.isArray(issueComment)) return null;
            // issueComment 必须是数组
            issueComment.unshift(issueBody);
            return issueComment
        };

        render() {
            const issueData = this.renderIssues();

            if (!issueData) return <Loading/>;

            return (
                <View style={{ flex: 1 }}>
                    <CList data={issueData}
                           extraData={this.props}
                           renderItem={this.renderComment}
                           ListEmptyComponent={() => <View style={styles.empty}><Text>None</Text></View>}/>
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
        backgroundColor: '#ffffff'
    },
    commentAvatar: { width: 32, height: 32, borderRadius: 16 },
    commentText: { fontSize: 12, color: '#333' },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(10,10,10, 0.2)'
    },
    empty: { height: dp(250), justifyContent: 'center', alignItems: 'center' }
});
