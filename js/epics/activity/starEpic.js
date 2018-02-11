import { Observable } from 'rxjs/Rx'
import { actTypes, starCount, errStarCount, stars, errStars, stared, unstared } from '../../reducers/activityReducer'

const err = '网不好，等哈再试';
export const starCountEpic = (action$, { getState }, { get }) => action$.ofType(actTypes.GET_STAR_COUNT)
    .switchMap(({ payload }) => {
        const { username } = payload;
        let url = '/user/starred?per_page=1';
        if (username) {
            url = `/users/${username}/starred?per_page=1`
        }
        const headers = { "Authorization": `token ${getState().userSignInfo.auth.token}` };

        return get(url, headers).map(({ xhr }) => {
            const number = xhr.getResponseHeader('LINK').split('&')[2].match(/\d+/g); //匹配最后的分页数
            return starCount(number[number.length - 1])
        }).catch(e => {
            toast(err);
            return Observable.of(errStarCount())
        })

    });

export const starsEpic = (action$, { getState }, { get }) => action$.ofType(actTypes.GET_STARS)
    .switchMap(({ payload }) => {
        const { username, page } = payload;
        let url = '/user/starred?page=' + page;
        if (username) {
            url = `/users/${username}/starred?page=${page}`
        }
        const headers = { "Authorization": `token ${getState().userSignInfo.auth.token}` };

        return get(url, headers).map(({ response }) => stars(response))
            .catch(e => {
                toast(err);
                return Observable.of(errStars())
            })

    });

export const staringEpic = (action$, { getState }, { get }) => action$.ofType(actTypes.STARING)
    .mergeMap(({ payload }) => {
        console.log('payload -> ', payload);
        const { ownerRepo } = payload;
        let url = `/user/starred/${ownerRepo}`;
        const headers = { "Authorization": `token ${getState().userSignInfo.auth.token}` };
        return get(url, headers).map(({ status }) => stared())
            .catch(e => {
                console.log(e);
                return Observable.of(unstared())
            })
    });


