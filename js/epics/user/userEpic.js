import {
    UserTypes,
    clearUser,
    getUserInfo,
    userSignAccept,
    userSignDenied,
    repoList,
    deleteAuth,
} from '../../reducers/userReducer';
import {openToast, putError, closeModal} from '../../reducers/comReducer';
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
        const headers = {"Authorization": `Basic ${auth}`};
        const body = {note, scopes, fingerprint, client_secret};

        return put(url, body, headers)
            .map(({status, response}) => {
                // 重构登录逻辑 对201做正常处理，对200 抛出异常
                if (status === 200) throw {status: 200, desc: 'Signature invalid', auth, id: response.id};
                return response
            })
            // 进入授权登录流程
            .map(auth => userSignAccept(auth))
            .catch(err => {
                let error$;
                switch (err.status) {
                    case 401: // 验证账户或者密码有误，被拒绝 -> 重置状态
                        error$ = Observable.of(putError('Invalid Username or password')); //发起UI错误提示
                        break;
                    case 200:
                        // 重写
                        error$ = Observable.of(deleteAuth({id: err.id}));
                        break;
                    case 422:
                        error$ = Observable.of(putError('账号未进行邮箱，无法取得授权'));
                        break;
                    default:
                        console.log('--> 超时', err);
                        error$ = Observable.of(putError('网络状态不佳，请稍后再试'));// 超时处理
                }
                return error$.startWith(closeModal()).delay(10).startWith(userSignDenied()) // 最先完成进行数据清理
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
            .startWith(closeModal())
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
                throw {status} // 主动抛出错误
            })
            .startWith(clearUser()).delay(20).startWith(openToast('已退出授权'))
            .catch(err => {
                let err$ = Observable.of(putError('网络状态不佳，请稍后再试'));
                console.log('err', err);
                if (err.status === 204) {
                    err$ = Observable.of(openToast('已退出授权')).startWith(clearUser()).delay(10).startWith(userSignDenied())
                }
                return err$
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
    }).catch(({status}) => {
        if (status === 404) {
            return Observable.of(clearUser()).startWith(userSignDenied()) // 在清理用户信息之前，取消授权
        }
        return Observable.of(putError('网络状态不佳，请稍后再试'))
    });

/**
 * 获取仓库列表
 * @param action$
 * @param getState
 * @param get
 */
export const proListEpic = (action$, {getState}, {get}) => action$.ofType(UserTypes.GET_PRO_LIST)
    .switchMap(({payload}) => {
        // todo 列表排序
        const {username} = payload;
        const {auth} = getState().userSignInfo;
        const headers = {"Authorization": "token " + auth.token};

        let url = '/user/repos' + getParams({sort: 'pushed'});
        if (username) {
            url = `/users/${username}/repos${getParams({sort: 'pushed'})}`
        }

        return get(url, headers).map(({response}) => repoList(response))
            .catch(e => {
                console.log(e);
                return Observable.of(putError('network timeout'))
            })

    }).catch(e => {
        console.log(e);
        return Observable.of(putError('网络状态不佳，请稍后再试'))
    });
