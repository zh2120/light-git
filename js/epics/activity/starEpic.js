import {Observable} from 'rxjs/Rx'
import {putError} from '../../reducers/comReducer';
import {actTypes, starCount, errStarCount, stars, errStars} from '../../reducers/activityReducer'

export const starCountEpic = (action$, {getState}, {get}) => action$.ofType(actTypes.GET_STAR_COUNT)
    .switchMap(({payload}) => {
        const {username} = payload;
        let url = '/user/starred?per_page=1';
        if (username) {
            url = `/users/${username}/starred?per_page=1`
        }
        const headers = {"Authorization": `token ${getState().userSignInfo.auth.token}`};

        return get(url, headers).map(({xhr}) => {
            const number = xhr.getResponseHeader('LINK').split('&')[2].match(/\d+/g); //匹配最后的分页数
            return starCount(number[number.length - 1])
        }).catch(e => Observable.of(putError('计数错误')).startWith(errStarCount()))

    });

export const starsEpic = (action$, {getState}, {get}) => action$.ofType(actTypes.GET_STARS)
    .switchMap(({payload}) => {
        const {username, page} = payload;
        let url = '/user/starred?page=' + page;
        if (username) {
            url = `/users/${username}/starred?page=${page}`
        }
        const headers = {"Authorization": `token ${getState().userSignInfo.auth.token}`};

        return get(url, headers).map(({response}) => stars(response))
            .catch(e => {
                console.log(e)
                return Observable.of(putError('获取失败')).startWith(errStars())
            })

    });
