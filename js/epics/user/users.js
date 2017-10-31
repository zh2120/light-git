import * as Types from '../../actions/types';
import {userSignAccept, getUserInfo, userSignDenied, deleteAuth, exit} from '../../actions/users';
import {openToast, putError} from '../../actions/common';
import {Observable} from 'rxjs/Rx'

export function userSignInEpic(action$, {dispatch}, {put}) {
    // 创建或者获取指定应用的授权
    return action$.ofType(Types.USER_SIGNIN)
        .switchMap(action => {
            const {auth} = action.payload
            const config = require('../../../config.json')
            const url = '/authorizations/clients/' + config.client_id
            const headers = {
                "Authorization": `Basic ${auth}`
            }
            const body = {
                note: config.note,
                scopes: config.scopes,
                fingerprint: config.fingerprint,
                client_secret: config.client_secret
            }
            /*
            .catch() 放到了 .mergeMap() 内部，AJAX 调用的后面;
            如果让错误到达 action$.ofType()，epic 会终止并且不会监听任何 actions。
             */
            return put(url, body, headers)
                .map(res => res.response || res)
                .map(auth => {
                    return userSignAccept(auth)
                })
                .catch(err => {
                    if (err.status === 401) {
                        dispatch(userSignDenied()) // 验证账户或者密码有误，被拒绝 -> 重置状态
                        return Observable.of(putError('Invalid Username or password')) // 发起UI错误提示
                    }
                    // 其他错误
                    dispatch(userSignDenied())
                    return Observable.of(putError('网络超时'))
                        .takeUntil(action$.ofType(Types.USER_SIGNIN_DENIED)) // 取消上一个action流
                })
        })
}


export function userInfoEpic(action$, {dispatch}, {get}) {
    return action$.ofType(Types.USER_SIGNIN_ACCEPT)
        .switchMap(action => {
            const {token, id} = action.payload.auth
            const url = '/user'
            const headers = {
                "Authorization": `token ${token}`
            }
            return get(url, headers)
                .map(res => res.response || res)
                .map(user => {
                    dispatch(openToast('授权登录成功！'))
                    return getUserInfo(user)
                })
                .catch(err => {
                    // if (err.status === 401) {
                    //     dispatch(deleteAuth(id))
                    // }
                    return Observable.of(deleteAuth())
                })
            // return Observable.of() // 发起UI错误提示
        })
}

export function clearUserInfoEpic(action$, {dispatch, getState}, ajax) {
    return action$.ofType(Types.DELETE_AUTH)
        .mergeMap(() => {
            const {id} = getState().userSignInfo.auth
            const url = `/authorizations/${id}`
            const auth = getState().userSignInfo.basic
            const headers = {
                "Authorization": `Basic ${auth}`
            }

            return ajax.delete(url, headers)
                .map(res => {
                    console.log('--> ', res)
                    return exit()
                })
                .catch(err => {
                    console.log('-===> ', err)
                    return Observable.of(putError('清除用户数据失败'))
                })
        })
}