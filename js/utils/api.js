import {ajax} from 'rxjs/observable/dom/ajax';

function create(baseUrl) {

    const time = 30000
    const defaultHeaders = {
        "Content-Type": "application/vnd.github.v3+json",
        "Accept": "application/vnd.github.v3+json",
    }
    const apiArr = ["GET", "DELETE", "PATCH", "PUT", "POST"]
    const api = {}

    for (let i = 0; i < apiArr.length; i++) {
        if (apiArr[i] === "GET" || apiArr[i] === "DELETE") {
            api[apiArr[i].toLowerCase()] = (url, headers, config) => new ajax({
                time, ...config, url: baseUrl + url, headers: {
                    ...headers,
                    ...defaultHeaders
                }
            })
        }
        api[apiArr[i].toLowerCase()] = (url, body, headers, config) => new ajax({
            body, time, ...config,
            url: baseUrl + url,
            headers: {
                ...headers,
                ...defaultHeaders
            }
        })
    }

    return api
}

export default create("https://api.github.com")
