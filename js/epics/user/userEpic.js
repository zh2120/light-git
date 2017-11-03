import * as Types from '../../actions/types';
import {userSignAccept, getUserInfo, userSignDenied, deleteAuth, exit, clearUser} from '../../actions/users';
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
                .map(res => {
                    switch (res.status) {
                        case 201:
                            return res.response
                        case 200:
                            throw {status: 200, desc: 'Signature invalid', id: res.response.id} // 已存在其他token，当前签名失效
                        default:
                            return res.response || res
                    }
                }) // todo 重构登录逻辑 对201做正常处理，对200 抛出异常
                .map(auth => userSignAccept(auth)) // 进入授权登录流程Å)
                .catch(err => {
                    switch (err.status) {
                        case 401: // 验证账户或者密码有误，被拒绝 -> 重置状态
                            dispatch(putError('Invalid Username or password')) // 发起UI错误提示
                            break
                        case 200: // 已在其他设备登录过了，
                            // 1、发起签名失效错误提示,
                            console.log('发起签名失效错误提示')
                            // dispatch(putError(err.desc))
                            // 2、清除之前用户的所有信息，退出操作
                            dispatch(deleteAuth({id: err.id}))
                            break
                        default:
                            console.log('--> 超时', err)
                            dispatch(putError('Network timeout')) // 超时处理
                    }
                    return Observable.of(userSignDenied())
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
                    return Observable.of(deleteAuth({id}))
                })
            // return Observable.of() // 发起UI错误提示
        })
}

export function clearUserInfoEpic(action$, {dispatch, getState}, ajax) {
    return action$.ofType(Types.DELETE_AUTH)
        .mergeMap(action => {
            const {id} = action.payload
            const url = `/authorizations/${id}`
            const auth = getState().userSignInfo.basic
            const headers = {
                "Authorization": `Basic ${auth}`
            }

            return ajax.delete(url, headers)
                .map(res => {
                    switch (res.status) {
                        case 204:
                            dispatch(openToast('已退出其他设备的授权，重新登录'))
                        default:
                            dispatch(userSignDenied())
                    }
                    return clearUser() // 清理用户信息
                })
                .catch(err => {
                    console.log('err', err)
                    return Observable.of(putError('清除用户数据失败'))
                })
        })
}