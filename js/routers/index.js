import React, {PureComponent} from 'react'
import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import {Easing, Animated, BackHandler} from 'react-native'
import PropTypes from 'prop-types'

import {connect} from "react-redux";
import Search from './Search'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Home from './Home'

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
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
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

let init = 'Home'
const initialState = (routerName) =>
    Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(routerName))

export const navReducer = (state = initialState(init), action) => {
    switch (action.type) {
        case 'Navigation/BACK':
            if (action.routeName) {
                console.log('___ 2', action.payload)
                // 寻找栈里，已经存在的场景索引
                const i = state.routes.findIndex(item => item.routeName === action.routeName);

                // 返回从栈底到指定的路由
                return {index: i, routes: state.routes.slice(0, i + 1)}
            }
            return {index: state.index - 1, routes: state.routes.slice(0, state.index)}; // 返回上一层
        case 'persist/REHYDRATE': // 未登录 重置登录
            if (!action.payload.userSignInfo.auth) {
                return initialState('SignIn')
            }
        default:
            return Navigator.router.getStateForAction(action, state);
    }
};

export default connect(state => ({nav: state.nav}))(
    class extends PureComponent {

        componentDidMount() {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
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









