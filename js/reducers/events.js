export const EventsType = {
    received: 'ing/events',
    getEvents: 'data/getEvents',
    errEvents: 'error/events'
};

export const events = (username) => ({ type: EventsType.received, payload: { username } });
export const getEvents = (events) => ({ type: EventsType.getEvents, payload: { events } });
export const errEvents = () => ({ type: EventsType.errEvents });

const initEvents = { events: [] };

export default (state = initEvents, { type, payload }) => {
    switch (type) {
        case EventsType.getEvents: {
            return { ...state, events: payload.events }
        }

        case EventsType.errEvents: {
            return { ...state, events: [] }
        }

        default:
            return state;
    }
}
