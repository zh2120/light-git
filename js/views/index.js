import React, { PureComponent } from 'react'
import { StackNavigator, NavigationActions, addNavigationHelpers } from 'react-navigation';
import { Easing, Animated, BackHandler, NetInfo } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { connect } from "react-redux";
import { createReactNavigationReduxMiddleware, createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { Home, Search, SignIn, SignUp, User } from './user/'
import { RepoHome, Readme, RepoDir, RepoIssues, RepoFile, UserProList } from './repos/'
import { StarsList } from './activity/'
import { getCheckedAuth } from "../reducers/userReducer";
import { putError } from "../reducers/comReducer";
import { CAlert, CLoading } from '../components'
const navigationEnhancer = ({ navigation, navigationOptions, screenProps }) => {
    const defaultHeaderStyle = {
        height: 72,
        elevation: 0,
        paddingTop: 24,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: null,
        backgroundColor: '#333'
    };

    return {
        ...navigationOptions,
        gesturesEnabled: true,
        headerTintColor: '#ffffff',
        headerStyle: { ...defaultHeaderStyle, ...navigationOptions.headerStyle }
    }
};

const MainRouters = {
    Home: { screen: Home },
    User: { screen: User },
    Search: { screen: Search },
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    Readme: { screen: Readme },
    RepoDir: { screen: RepoDir },
    RepoHome: { screen: RepoHome },
    RepoFile: { screen: RepoFile },
    RepoIssues: { screen: RepoIssues },
    UserProList: { screen: UserProList },
    StarsList: { screen: StarsList }
};

for (const key in MainRouters) {
    MainRouters[key].navigationOptions = navigationEnhancer
}

/**
 * 页面切换动画配置
 */
const transitions = {
    transitionConfig: (transitionProps, prevTransitionProps) => ({
        transitionSpec: {
            duration: 300,
            timing: Animated.timing,
            easing: Easing.out(Easing.poly(4)),
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene, progress } = sceneProps;
            const { index } = scene;
            const width = layout.initWidth;
            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [width, 0, 0],
            });

            const scale = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [1, 1, 0.9],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index, index + 0.999, index + 1],
                outputRange: [0, 1, 0.3, 0],
            });

            return { opacity, transform: [{ translateX }, { scale }] };
        }
    })
};

export const Navigator = StackNavigator(MainRouters, {
    headerMode: 'screen',
    navigationOptions: {
        gesturesEnabled: false,
    },
    ...transitions
});

const init = 'Home';

const initialState = (routerName) =>
    Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(routerName));

export const navReducer = (state = initialState(init), action) => {
    switch (action.type) {
        case 'Navigation/NAVIGATE':
            const { routes } = state;

            if (action.routeName !== 'RepoDir' && routes[routes.length - 1].routeName === action.routeName) return state;

            return Navigator.router.getStateForAction(action, state);
        case 'Navigation/BACK':
            if (action.routeName) {
                // 寻找栈里，已经存在的场景索引
                const i = state.routes.findIndex(item => item.routeName === action.routeName);
                CAlert.close();
                CLoading.close();
                // 返回从栈底到指定的路由
                return { index: i, routes: state.routes.slice(0, i + 1) }
            }
            // 返回上一层
            if (state.index > 0) return { index: state.index - 1, routes: state.routes.slice(0, state.index) };
            return initialState(init);

        case 'Navigation/SET_PARAMS':
            const nextRoutes = state.routes.map((item) => {
                if (item.key === action.key) { // 对当前页面，设置参数
                    return { ...item, params: { ...item.params, ...action.params } }
                }
                return item
            });
            return { ...state, routes: nextRoutes };
        case 'Navigation/RESET':
            return { ...Navigator.router.getStateForAction(action) };

        default:
            return state
    }
};

export const navigation = createReactNavigationReduxMiddleware("root", state => state.nav);
const addListener = createReduxBoundAddListener("root");

export default connect(({ nav, userSignInfo }) => ({ nav, auth: userSignInfo.auth }))(
    class extends PureComponent {

        componentWillMount() {
            // 验证token的有效性
            const { dispatch, auth } = this.props;
            if (auth) {
                dispatch(getCheckedAuth())
            }
        }

        componentDidMount() {
            // 网络连接的监听
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
            NetInfo.addEventListener('connectionChange', this.connectivityChange);
            SplashScreen.hide();
        }

        componentWillUnmount() {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
            NetInfo.removeEventListener('connectionChange', this.connectivityChange);
        }

        connectivityChange = () => this.props.dispatch(putError('网络似乎出现了异常'));

        onBackPress = () => {
            const { dispatch, nav } = this.props;

            if (nav.index === 0) {
                return false;
            }
            dispatch(NavigationActions.back());
            return true;
        };

        render() {
            const { dispatch, nav } = this.props;

            return <Navigator navigation={addNavigationHelpers({ dispatch, state: nav, addListener })}/>
        }
    }
);
