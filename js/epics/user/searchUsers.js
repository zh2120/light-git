import * as ActionTypes from '../../actions/types';
import {receiveUsers} from '../../actions';
import {ajax} from 'rxjs/observable/dom/ajax';

export default function searchUsers(action$) {
    return action$.ofType(ActionTypes.SEARCHED_USERS)
        .switchMap(action => {
            const {query} = action.payload
            return ajax({
                url: `https://api.github.com/search/users?q=${query}`,
                method: 'GET',
                responseType: 'json'
            })
        })
        .map(res => res.response || res)
        .map(users => receiveUsers(users.items))
        .catch(error => {
            console.log(error)
        })
};