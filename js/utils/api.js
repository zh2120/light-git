import {ajax} from 'rxjs/observable/dom/ajax';

const api = 'https://api.github.com'
const defaultHeaders = {
    "Content-Type": "application/vnd.github.mercy-preview+json"
}

export const enhancerGet = (url = '', headers = {}) =>
    ajax.get((api + url), {...defaultHeaders, ...headers})

export const enhancerPost = (url = '', body = {}, headers = {}) =>
    ajax.post((api + url), JSON.stringify(body), {...defaultHeaders, ...headers})

export const enhancerPut = (url = '', body = {}, headers = {}) =>
    ajax.put((api + url), JSON.stringify(body), {...defaultHeaders, ...headers})

export const enhancerPatch = (url = '', body = {}, headers = {}) =>
    ajax.patch((api + url), JSON.stringify(body), {...defaultHeaders, ...headers})

export const enhancerDelete = (url = '', headers = {}) =>
    ajax.delete((api + url), {...defaultHeaders, ...headers})
