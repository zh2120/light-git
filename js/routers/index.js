import React, {Component} from 'react'
import {StackNavigator, NavigationActions, addNavigationHelpers} from 'react-navigation';
import {Easing, Animated, BackHandler} from 'react-native'
import PropTypes from 'prop-types'

import {connect} from "react-redux";
import Main from './Main'
import Search from './Search'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Home from './Home'
import Test from './Test'
import RepoHome from './repos/'
import RepoFile from './repos/File'
import RepoDir from './repos/Dir'
import Readme from './repos/Readme'

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

const MainRouters = {
    Home: {screen: Home},
    RepoHome: {screen: RepoHome},
    RepoFile: {screen: RepoFile},
    RepoDir: {screen: RepoDir},
    Search: {screen: Search},
    SignIn: {screen: SignIn},
    SignUp: {screen: SignUp},
    Test: {screen: Test},
    Main: {screen: Main},
    Readme: {screen: Readme}
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

const initialState = Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams('Home'))

export const navReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'Navigation/BACK':
            if (action.routeName) { // 重置路由
                // 寻找栈里，已经存在的场景索引
                const i = state.routes.findIndex(item => item.routeName === action.routeName)

                // 返回从栈底到指定的路由
                return {index: i, routes: state.routes.slice(0, i + 1)}
            }
        default:
            return Navigator.router.getStateForAction(action, state);

    }
};

const AppWithNavigationState = ({dispatch, nav}) => (
    <Navigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
);

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

export default connect(state => ({nav: state.nav}))(
    class extends Component {

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









