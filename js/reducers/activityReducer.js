export const actTypes = {
    STARS: 'STARS',
    STARING: 'STARING',
    STARED: 'STARED',
    UNSTAR: 'UNSTAR',
    RESET_STAR: 'RESET_STAR',
    ERR_STARS: 'ERR_STARS',
    GET_STARS: 'GET_STARS',
    STAR_COUNT: 'STAR_COUNT',
    ERR_STAR_COUNT: 'ERR_STAR_COUNT',
    GET_STAR_COUNT: 'GET_STAR_COUNT'
};

/**
 * 获取指定用户名的星星总数
 * @param username
 */
export const getStarCount = (username) => ({
    type: actTypes.GET_STAR_COUNT,
    payload: { username }
});

export const starCount = (count) => ({ type: actTypes.STAR_COUNT, payload: { count } });

export const errStarCount = () => ({ type: actTypes.ERR_STAR_COUNT });

/**
 * 获取指定用户名的关注的项目列表
 * @param username
 * @param page 分页
 */
export const getStars = ({ username, page }) => ({ type: actTypes.GET_STARS, payload: { username, page } });

export const stars = (starsList) => ({ type: actTypes.STARS, payload: { stars: starsList } });

export const errStars = () => ({ type: actTypes.ERR_STARS });

export const staring = (ownerRepo) => ({ type: actTypes.STARING, payload: { ownerRepo } });
export const stared = () => ({ type: actTypes.STARED});
export const unstared = () => ({ type: actTypes.UNSTAR});
export const resetStar = () => ({ type: actTypes.RESET_STAR});

/**
 *
 * @param state count 星星总数
 * @param type
 * @param payload
 * @returns {*}
 */
const initStar = { count: 0, stars: null, stared: false };
export default (state = initStar, { type, payload }) => {
    switch (type) {
        case actTypes.STARED:
            return { ...state, stared: true };
        case actTypes.RESET_STAR:
            return { ...state, stared: false };
        case actTypes.STAR_COUNT:
            return { ...state, count: payload.count };
        case actTypes.ERR_STAR_COUNT:
            return { ...state, count: 0 };

        case actTypes.STARS:
            if (state.stars) {
                return { ...state, stars: [...state.stars, ...payload.stars] };
            }
            return { ...state, stars: payload.stars };

        case actTypes.ERR_STARS:
            return { ...state, stars: null };
        default:
            return state
    }
};
