import {
    UserTypes,
    clearUser,
    getUserInfo,
    userSignAccept,
    userSignDenied,
    repoList,
    errRepoList,
    deleteAuth
} from '../../reducers/userReducer';
import {openToast, putError} from '../../reducers/comReducer';
import {Observable} from 'rxjs/Rx'
// Rewrite over
/*.catch() 放到了 .mergeMap() 内部，AJAX 调用的后面;如果让错误到达 action$.ofType()，epic 会终止并且不会监听任何 actions。*/
/**
 * 正常获取用户授权
 * @param action$
 * @param dispatch
 * @param put
 */
export const userSignInEpic = (action$, {dispatch}, {put}) => action$.ofType(UserTypes.USER_SIGNIN)
    .switchMap(({payload}) => {
        const {auth} = payload;
        const {client_id, note, scopes, fingerprint, client_secret} = require('../../../config.json');
        const url = '/authorizations/clients/' + client_id;
        const headers = {
            "Authorization": `Basic ${auth}`
        };
        const body = {note, scopes, fingerprint, client_secret};

        return put(url, body, headers)
            .map(({status, response}) => {
                // 重构登录逻辑 对201做正常处理，对200 抛出异常
                if (status === 200) throw {status: 200, desc: 'Signature invalid', id: response.id};
                return response
            })
            // 进入授权登录流程å)，只有正常登录才有提示
            .map(auth => userSignAccept(auth))
            .catch(err => {
                let error$
                switch (err.status) {
                    case 401: // 验证账户或者密码有误，被拒绝 -> 重置状态
                        error$ = Observable.of(putError('Invalid Username or password')); //发起UI错误提示
                        break;
                    case 200:
                        error$ = Observable.of(deleteAuth({id: err.id}));
                        break;
                    default:
                        console.log('--> 超时', err);
                        error$ = Observable.of(putError('Network timeout'));// 超时处理
                }
                return error$.startWith(userSignDenied())
            })
    })
;

// todo 全局超时处理
/**
 * 正常获取用户信息
 * @param action$
 * @param dispatch
 * @param get
 */
export const userInfoEpic = (action$, {dispatch}, {get}) => action$.ofType(UserTypes.USER_SIGNIN_ACCEPT)
    .switchMap(({payload}) => {
        const {token} = payload.auth;
        const url = '/user';
        const headers = {"Authorization": `token ${token}`};

        return get(url, headers)
            .map(({response}) => getUserInfo(response))
            .startWith(openToast(' successful! '))
            .catch(err => Observable.of(userSignDenied()))
    });

/**
 * 清除用户信息
 * @param action$
 * @param dispatch
 * @param getState
 * @param ajax
 */
export const clearUserInfoEpic = (action$, {dispatch, getState}, ajax) => action$.ofType(UserTypes.DELETE_AUTH)
    .mergeMap(({payload}) => {
        const {id} = payload;
        const url = `/authorizations/${id}`;
        const auth = getState().userSignInfo.basic;
        const headers = {
            "Authorization": `Basic ${auth}`
        };

        return ajax.delete(url, headers)
            .map(({status}) => {
                if (status === 204) return userSignDenied();
                throw {err: '其他错误'}
            })
            .startWith(clearUser())
            .catch(err => {
                console.log('err', err);
                return Observable.of(putError('清除用户数据失败'))
            })
    });

/**
 * 检查授权列表
 * @param action$
 * @param getState
 * @param get
 */
export const checkAuthEpic = (action$, {getState}, {get}) => action$.ofType(UserTypes.GET_CHECK_AUTH)
    .switchMap(() => {
        const {auth} = getState().userSignInfo;
        const {client_id, client_secret} = require('../../../config.json');
        const headers = {"Authorization": "Basic " + btoa(client_id + ':' + client_secret)};
        const url = `/applications/${client_id}/tokens/${auth.token}`;

        return get(url, headers).map(() => ({type: 'Checked_Successfully'}))
    }).catch(err => Observable.of(userSignDenied()));

/**
 * 获取仓库列表
 * @param action$
 * @param getState
 * @param get
 */
export const repoListEpic = (action$, {getState}, {get}) => action$.ofType(UserTypes.GET_REPO_LIST)
    .switchMap(({payload}) => {
        const {username} = payload;
        const {auth} = getState().userSignInfo;
        const headers = {"Authorization": "token " + auth.token};

        let url = '/user/repos' + getParams({sort: 'pushed'});
        if (username) {
            url = `/users/${username}/repos${getParams({sort: 'pushed'})}`
        }

        return get(url, headers).map(({response}) => repoList(response))

    }).catch(e => {
        console.log(e);
        return Observable.of(putError('获取列表h失败'))
    });
