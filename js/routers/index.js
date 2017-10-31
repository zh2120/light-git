import React from 'react'
import {StackNavigator, NavigationActions} from 'react-navigation';
import {Easing, Animated} from 'react-native'

import Main from './Main'
import Search from './Search'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Home from './Home'
import Test from './Test'
import RepoHome from './repos/'
import RepoFile from './repos/File'

const navigationEnhancer = ({navigation, navigationOptions, screenProps}) => {
    const defaultHeaderStyle = {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
        height: 64,
        paddingTop: 24,
        borderBottomColor: null,
        borderBottomWidth: 0
    }
    const tmpStyle = Object.assign({}, defaultHeaderStyle, navigationOptions.headerStyle)
    return Object.assign({}, navigationOptions, {headerStyle: tmpStyle, gesturesEnabled: true})
};

export const MainRouters = {
    Home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },
    RepoHome: {
        screen: RepoHome,
        navigationOptions: {
            // header: null
        }
    },
    RepoFile: {
        screen: RepoFile,
        navigationOptions: {
            // header: null
        }
    },
    Test: {
        screen: Test,
        navigationOptions: {
            header: null
        }
    },
    Main: {
        screen: Main,
        title: '主页面',
        // navigationOptions: navigationEnhancer,
    },
    Search: {
        screen: Search,
        title: '搜索',
        navigationOptions: navigationEnhancer,
    },
    SignIn: {
        screen: SignIn,
        title: '登录',
        navigationOptions: navigationEnhancer,
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: navigationEnhancer,
    }
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
    // 默认页面组件
    initialRouteName: 'RepoHome',
    headerMode: 'screen',
    navigationOptions: {
        gesturesEnabled: false,
    },
    ...transitions
});

/**
 * 避免多次跳转
 * @param getStateForAction
 * @returns {function(*=, *=)}
 */
const navigateOnce = function (getStateForAction) {
    return (action, state) => {
        const {type, routeName} = action
        return (
            state &&
            type === NavigationActions.NAVIGATE &&
            routeName === state.routes[state.routes.length - 1].routeName // 路由刚刚压入栈，不触发操作
        ) ? null : getStateForAction(action, state)
    }
}
Navigator.router.getStateForAction = navigateOnce(Navigator.router.getStateForAction)


export default Navigator









