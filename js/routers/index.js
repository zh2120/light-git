import React, {PureComponent} from 'react'
import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import {Easing, Animated, BackHandler} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import {connect} from "react-redux";

import {Home, Search, SignIn, SignUp, User} from './user/'
import {RepoHome, Readme, RepoDir, RepoIssues, RepoFile} from './repos/'

const navigationEnhancer = ({navigation, navigationOptions, screenProps}) => {
    const defaultHeaderStyle = {
        height: 64,
        elevation: 0,
        paddingTop: 24,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: null,
        backgroundColor: 'rgba(30,144,255,0.6)'
    }

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
    RepoIssues: {screen: RepoIssues}
}

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
}

const Navigator = StackNavigator(MainRouters, {
    headerMode: 'screen',
    navigationOptions: {
        gesturesEnabled: false,
    },
    ...transitions
});

let init = 'User';
const initialState = (routerName) =>
    Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(routerName))

export const navReducer = (state = initialState(init), action) => {
    switch (action.type) {
        case 'Navigation/NAVIGATE':
            const {routes} = state;

            if (routes[routes.length - 1].routeName === action.routeName) return state;

            return Navigator.router.getStateForAction(action, state);
        case 'Navigation/BACK':
            if (action.routeName) {
                // 寻找栈里，已经存在的场景索引
                const i = state.routes.findIndex(item => item.routeName === action.routeName);

                // 返回从栈底到指定的路由
                return {index: i, routes: state.routes.slice(0, i + 1)}
            }
            if (state.index > 0) return {index: state.index - 1, routes: state.routes.slice(0, state.index)}; // 返回上一层
            return initialState(init)
        case 'persist/REHYDRATE': // 未登录 重置登录
            if (!action.payload.userSignInfo.auth) {
                return initialState('SignIn')
            }
            return state;
        default:
            return Navigator.router.getStateForAction(action, state);
    }
};

export default connect(state => ({nav: state.nav, auth: state.userSignInfo.auth}))(
    class extends PureComponent {

        componentWillMount() {
            // todo 验证token的有效性
        }

        componentDidMount() {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
            SplashScreen.hide();
            console.log(this.props)
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









