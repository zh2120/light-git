import React, {PureComponent} from 'react'
import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import {Easing, Animated, BackHandler} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import {connect} from "react-redux";

import {Home, Search, SignIn, SignUp, User} from './user/'
import {RepoHome, Readme, RepoDir, RepoIssues, RepoFile, UserProList} from './repos/'
import {getCheckedAuth} from "../reducers/userReducer";

const navigationEnhancer = ({navigation, navigationOptions, screenProps}) => {
    const defaultHeaderStyle = {
        height: 64,
        elevation: 0,
        paddingTop: 24,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: null,
        backgroundColor: 'rgba(30,144,255,0.6)'
    };

    return {
        ...navigationOptions,
        gesturesEnabled: true,
        headerTintColor: '#f7f7f7',
        headerStyle: {...defaultHeaderStyle, ...navigationOptions.headerStyle}
    }
};

const MainRouters = {
    Home: {screen: Home},
    User: {screen: User},
    Search: {screen: Search},
    SignIn: {screen: SignIn},
    SignUp: {screen: SignUp},
    Readme: {screen: Readme},
    RepoDir: {screen: RepoDir},
    RepoHome: {screen: RepoHome},
    RepoFile: {screen: RepoFile},
    RepoIssues: {screen: RepoIssues},
    UserProList: {screen: UserProList}
};

for (const key in MainRouters) {
    MainRouters[key].navigationOptions = navigationEnhancer
}

/**
 * 页面切换动画配置
 */
const transitions = {
    transitionConfig: () => ({
        transitionSpec: {
            duration: 300,
            timing: Animated.timing,
            easing: Easing.out(Easing.poly(4)),
        },
        screenInterpolator: sceneProps => {
            const {layout, position, scene} = sceneProps;
            const {index} = scene;
            const width = layout.initWidth;
            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [width, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return {opacity, transform: [{translateX}]};
        },
    }),
};

export const Navigator = StackNavigator(MainRouters, {
    headerMode: 'screen',
    navigationOptions: {
        gesturesEnabled: false,
    },
    ...transitions
});

export default connect(({nav, userSignInfo}) => ({nav: nav, auth: userSignInfo.auth}))(
    class extends PureComponent {

        componentWillMount() {
            // 验证token的有效性
            const {dispatch, auth} = this.props;
            if (auth) {
                dispatch(getCheckedAuth())
            }
        }

        componentDidMount() {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
            SplashScreen.hide();
        }

        componentWillUnmount() {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        }

        onBackPress = () => {
            const {dispatch, nav} = this.props;

            if (nav.index === 0) {
                return false;
            }
            dispatch(NavigationActions.back());
            return true;
        };

        render() {
            const {dispatch, nav} = this.props;

            return <Navigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
        }
    }
);









