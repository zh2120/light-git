import { Observable } from 'rxjs/Rx'
import { EventsType, getEvents, errEvents } from '../../reducers/events'

export const eventsEpic = (action$, { getState }, { get }) => action$.ofType(EventsType.received)
    .mergeMap(({ payload }) => {
        const { username } = payload;
        let url = `/users/${username}/received_events`;

        return get(url).map(({response}) => getEvents(response))
            .catch(() => {
                toast('网不好');
                return Observable.of(errEvents())
            })
    });