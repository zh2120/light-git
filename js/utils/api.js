import {ajax} from 'rxjs/observable/dom/ajax';

const requestConfig = {
    timeout: 10000,
    // timeout: 300,
    body: null,
    method: "GET",
    url: "https://api.github.com",
    headers: {
        "Content-Type": "application/json"
    }
};

export const get = (url, headers) => {
    return new ajax(Object.assign({}, requestConfig, {
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const put = (url, body, headers) => {
    return new ajax(Object.assign({}, requestConfig, {
        body: JSON.stringify(body),
        method: "PUT",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const Delete = (url, headers) => {
    return new ajax(Object.assign({}, requestConfig, {
        method: "DELETE",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const post = (url, body, headers) => {
    return new ajax(Object.assign({}, requestConfig, {
        body: JSON.stringify(body),
        method: "POST",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};

export const patch = (url, body, headers) => {
    return new ajax(Object.assign({}, requestConfig, {
        body: JSON.stringify(body),
        method: "PATCH",
        url: requestConfig.url + url,
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json",
            ...headers
        }
    }))
};
