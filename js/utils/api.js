import {ajax} from 'rxjs/observable/dom/ajax';

const requestConfig = {
    timeout: 30000,
    body: null,
    method: "GET",
    url: "https://api.github.com",
    headers: {

        "Content-Type": "application/vnd.github.v3+json",
        "Accept": "application/vnd.github.v3+json"
    }
};

export const get = (url, headers, config) => {
    return new ajax(Object.assign({}, requestConfig, {
        ...config,
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const put = (url, body, headers, config) => {
    return new ajax(Object.assign({}, requestConfig, {
        ...config,
        body: JSON.stringify(body),
        method: "PUT",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const Delete = (url, headers, config) => {
    return new ajax(Object.assign({}, requestConfig, {
        ...config,
        method: "DELETE",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const post = (url, body, headers, config) => {
    return new ajax(Object.assign({}, requestConfig, {
        ...config,
        body: JSON.stringify(body),
        method: "POST",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const patch = (url, body, headers, config) => {
    return new ajax(Object.assign({}, requestConfig, {
        ...config,
        body: JSON.stringify(body),
        method: "PATCH",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};
