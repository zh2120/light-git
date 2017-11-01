import React from 'react';
import {Dimensions, Platform} from 'react-native'

const {width, height} = Dimensions.get('window')
/**
 * 自适应解决方案 px 2 dp
 * @param px {Number} 设计图像素
 * @param useHeight {Boolean} 是否使用高度比
 * @returns {number}

 */
global.dp = function (px, useHeight = false) {
    return px * (useHeight ? height / 667 : width / 375)
}
global.vw = width
global.vh = height

global.ios = Platform.OS === 'ios'

if (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && global.originalXMLHttpRequest) {
    global.XMLHttpRequest = global.originalXMLHttpRequest
}

global.getParams = (params) => {
    if (typeof params === 'object') {
        const paramsArray = []
        Object.keys(params).map(key => paramsArray.push(key + '=' + params[key]))
        return '?' + paramsArray.join('&')
    }
}

global.isEmpty = (o) => {
    if (o instanceof Object) {
        for (let i in o) {
            return false
        }
        return true
    }
}
