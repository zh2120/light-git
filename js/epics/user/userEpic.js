import {
    UserTypes,
    clearUser,
    deleteAuth,
    getUserInfo,
    userSignAccept,
    userSignDenied,
} from '../../reducers/userReducer';
import {openToast, putError} from '../../reducers/comReducer';
import {Observable} from 'rxjs/Rx'
// todo Rewrite
export const userSignInEpic = (action$, {dispatch}, {put}) => action$.ofType(UserTypes.USER_SIGNIN)
    .switchMap(action => {
        const {auth} = action.payload;
        const config = require('../../../config.json');
        const url = '/authorizations/clients/' + config.client_id;
        const headers = {
            "Authorization": `Basic ${auth}`
        };
        const body = {
            note: config.note,
            scopes: config.scopes,
            fingerprint: config.fingerprint,
            client_secret: config.client_secret
        };
        /*
        .catch() 放到了 .mergeMap() 内部，AJAX 调用的后面;
        如果让错误到达 action$.ofType()，epic 会终止并且不会监听任何 actions。
         */
        return put(url, body, headers)
            .map(res => {
                switch (res.status) {
                    case 201:
                        return res.response;
                    case 200:
                        // 已存在其他token，当前签名失效
                        throw {status: 200, desc: 'Signature invalid', id: res.response.id};
                    default:
                        return res.response || res
                }
            }) // todo 重构登录逻辑 对201做正常处理，对200 抛出异常
            .map(auth => userSignAccept(auth)) // 进入授权登录流程Å)
            .catch(err => {
                switch (err.status) {
                    case 401: // 验证账户或者密码有误，被拒绝 -> 重置状态
                        dispatch(putError('Invalid Username or password')); // 发起UI错误提示
                        break
                    case 200: // 已在其他设备登录过了，
                        // 1、发起签名失效错误提示,
                        console.log('发起签名失效错误提示');
                        // dispatch(putError(err.desc))
                        // 2、清除之前用户的所有信息，退出操作
                        dispatch(deleteAuth({id: err.id}));
                        break
                    default:
                        console.log('--> 超时', err);
                        dispatch(putError('Network timeout')) // 超时处理
                }
                return Observable.of(userSignDenied())
            })
    });


export const userInfoEpic = (action$, {dispatch}, {get}) => action$.ofType(UserTypes.USER_SIGNIN_ACCEPT)
    .switchMap(action => {
        const {token, id} = action.payload.auth;
        const url = '/user';
        const headers = {
            "Authorization": `token ${token}`
        };

        return get(url, headers)
            .map(res => res.response || res)
            .map(user => {
                dispatch(openToast('授权登录成功！'));
                return getUserInfo(user)
            })
            .catch(err => {
                // if (err.status === 401) {
                //     dispatch(deleteAuth(id))
                // }
                return Observable.of(deleteAuth({id}))
            })
    });

export const clearUserInfoEpic = (action$, {dispatch, getState}, ajax) => action$.ofType(UserTypes.DELETE_AUTH)
    .mergeMap(action => {
        const {id} = action.payload;
        const url = `/authorizations/${id}`;
        const auth = getState().userSignInfo.basic;
        const headers = {
            "Authorization": `Basic ${auth}`
        };

        return ajax.delete(url, headers)
            .map(res => res.status === 204 && openToast('已退出设备的授权'))
            .startWith(userSignDenied()) // 清空权限
            .startWith(clearUser()) // 清空用户的数据
            .catch(err => {
                console.log('err', err);
                return Observable.of(putError('清除用户数据失败'))
            })
    });

export const checkAuthEpic = (action$, {getState}, {get}) => action$.ofType(UserTypes.GET_CHECK_AUTH)
    .switchMap(action => {
        const {auth} = getState().userSignInfo;
        const {client_id, client_secret} = require('../../../config.json');
        const headers = {"Authorization": "Basic" + btoa(`${client_id}:${client_secret}`)};
        const url = `/applications/${client_id}/tokens/${auth.token}`;

        return get(url, headers).map(res => {
            console.log(res.response);
            const {response, status} = res;
            if (status === 404) {
                return Observable.of(putError('授权过期了')).startWith(deleteAuth(auth.id))
            }
            return userSignAccept(response)
        })
    }).catch(err => {
        console.log(err);
        return Observable.of(putError('检查auth失败'))
    });
