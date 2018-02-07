import {
    UserTypes,
    clearUser,
    getUserInfo,
    userSignAccept,
    userSignDenied,
    repoList,
    errRepoList,
    deleteAuth,
    userSignIn,
} from '../../reducers/userReducer';
import { Observable } from 'rxjs/Rx'
// Rewrite over
/*.catch() 放到了 .mergeMap() 内部，AJAX 调用的后面;如果让错误到达 action$.ofType()，epic 会终止并且不会监听任何 actions。*/
/**
 * 正常获取用户授权
 * @param action$
 * @param getState
 * @param put
 */

const config = require('../../../config.json');
const netWork = '这糟糕的网络，我也没的办法，重新试哈嘛';
export const userSignInEpic = (action$, { getState }, { put }) => action$.ofType(UserTypes.USER_SIGNIN)
    .switchMap(({ payload }) => {
        const { auth } = payload;
        const { client_id, note, scopes, fingerprint, client_secret } = config;
        const url = '/authorizations/clients/' + client_id;
        const headers = { "Authorization": `Basic ${auth}` };
        const body = { note, scopes, fingerprint, client_secret };

        return put(url, body, headers)
            .map(({ status, response }) => {
                // 重构登录逻辑 对201做正常处理，对200 抛出异常
                if (status === 200) throw { status: 200, desc: '已经注销其他设备的授权，重新授权本设备', auth, id: response.id };
                return response
            })
            // 进入授权登录流程
            .map(auth => userSignAccept(auth))
            .catch(err => {
                let error;
                switch (err.status) {
                    case 401: // 验证账户或者密码有误，被拒绝 -> 重置状态
                        // error$ = Observable.of(userSignDenied('Invalid Username or password')); //发起UI错误提示
                        error = '用户名或者密码无效，核对一哈嘛';
                        break;
                    case 200:
                        // 重写
                        toast(err.desc);
                        // return Observable.of(deleteAuth(err.id), userSignIn(auth));
                        return Observable.of(deleteAuth(err.id));
                        break;
                    case 422:
                        error = '账号还么有邮箱，拿不到github的授权';
                        break;
                    default:
                        error = netWork;// 超时处理
                }
                toast(error);
                return Observable.of(userSignDenied()) // 最先完成进行数据清理
            })
    });

// todo 全局超时处理
/**
 * 正常获取用户信息
 * @param action$
 * @param state
 * @param get
 */
export const userInfoEpic = (action$, state, { get }) => action$.ofType(UserTypes.USER_SIGNIN_ACCEPT)
    .switchMap(({ payload }) => {
        const { token } = payload.auth;
        const url = '/user';
        const headers = { "Authorization": `token ${token}` };

        return get(url, headers)
            .map(({ response }) => getUserInfo(response))
            .catch(err => {
                toast(netWork);
                return Observable.of(userSignDenied())
            })
    });

/**
 * 清除用户信息
 * @param action$
 * @param getState
 * @param ajax
 */
export const clearUserInfoEpic = (action$, { getState }, ajax) => action$.ofType(UserTypes.DELETE_AUTH)
    .mergeMap(({ payload }) => {
        const { id } = payload;
        const url = `/authorizations/${id}`;
        const auth = getState().userSignInfo.basic;
        const headers = {
            "Authorization": `Basic ${auth}`
        };

        return ajax.delete(url, headers)
            .map(({ status }) => {
                if (status === 204) {
                    return userSignDenied()
                }
            })
            .concat(Observable.of(clearUser()))
            .catch(err => {
                toast(netWork);
                return Observable.of(userSignDenied())
            })
    });

/**
 * 检查授权列表
 * @param action$
 * @param getState
 * @param get
 */
export const checkAuthEpic = (action$, { getState }, { get }) => action$.ofType(UserTypes.GET_CHECK_AUTH)
    .switchMap(() => {
        const { auth } = getState().userSignInfo;
        const { client_id, client_secret } = config;
        const headers = { "Authorization": "Basic " + btoa(client_id + ':' + client_secret) };
        const url = `/applications/${client_id}/tokens/${auth.token}`;

        return get(url, headers).map(() => ({ type: 'Checked_Successfully' }))
    }).catch(({ status }) => {
        if (status === 404) {
            toast('其他设备已经注销授权')
        } else {
            toast(netWork)
        }
        return Observable.of(clearUser(), userSignDenied()) // 在清理用户信息之前，取消授权
    });

/**
 * 获取仓库列表
 * @param action$
 * @param getState
 * @param get
 */
export const proListEpic = (action$, { getState }, { get }) => action$.ofType(UserTypes.GET_PRO_LIST)
    .switchMap(({ payload }) => {
        // todo 列表排序
        const { username } = payload;
        const { auth } = getState().userSignInfo;
        const headers = { "Authorization": "token " + auth.token };

        let url = '/user/repos' + getParams({ sort: 'pushed' });
        if (username) {
            url = `/users/${username}/repos${getParams({ sort: 'pushed' })}`
        }

        return get(url, headers).map(({ response }) => repoList(response))
            .catch(e => {
                console.log(e);
                toast(netWork);
                return Observable.of(errRepoList())
            })

    });
