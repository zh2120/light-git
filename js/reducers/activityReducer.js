export const actTypes = {
    GET_STAR_COUNT: 'GET_STAR_COUNT',
    STAR_COUNT: 'STAR_COUNT',
    ERR_STAR_COUNT: 'ERR_STAR_COUNT'
};

/**
 * 获取指定用户名的星星总数 或者列表
 * @param username
 */
export const getStarCount = (username) => ({
    type: actTypes.GET_STAR_COUNT,
    payload: {username}
});

export const starCount = (count) => ({type: actTypes.STAR_COUNT, payload: {count}});

export const errStarCount = () => ({type: actTypes.ERR_STAR_COUNT});

/**
 *
 * @param state count 星星总数
 * @param type
 * @param payload
 * @returns {*}
 */
export default (state = {count: 0}, {type, payload}) => {
    switch (type) {
        case actTypes.STAR_COUNT:
            return {...state, count: payload.count};
        case actTypes.ERR_STAR_COUNT:
            return {...state, count: 0};
        default:
            return state
    }
};
