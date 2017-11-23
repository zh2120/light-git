import {ajax} from 'rxjs/observable/dom/ajax';

function create(baseUrl) {

    const timeout = 20000;
    const defaultHeaders = {
        "Content-Type": "application/vnd.github.mercy-preview+json",
        "Accept": "application/vnd.github.v3+json",
    };
    const apiArr = ["GET", "DELETE", "PATCH", "PUT", "POST"];
    const api = {};

    for (let i = 0; i < apiArr.length; i++) {
        if (apiArr[i] === "GET" || apiArr[i] === "DELETE") {
            api[apiArr[i].toLowerCase()] = (url, headers, config) =>
                new ajax(Object.assign({}, {
                    timeout,
                    url: baseUrl + url,
                    method: apiArr[i],
                    headers: {...defaultHeaders, ...headers}
                }, config));
            continue
        }
        api[apiArr[i].toLowerCase()] = (url, body, headers, config) =>
            new ajax(Object.assign({}, {timeout, url: baseUrl + url}, {
                    body: JSON.stringify(body),
                    ...config,
                    method: apiArr[i],
                    headers: {...defaultHeaders, ...headers}
                })
            )
    }

    return api
}

export default create("https://api.github.com")
