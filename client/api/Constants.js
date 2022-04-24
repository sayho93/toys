const URL = process.env.NODE_ENV === 'production' ? 'https://psyho.pw:3000' : 'http://localhost:4000'
const API_ENDPOINT = `${URL}/api/v1`

const Constants = {
    URL: URL,

    // USER
    API_SIGNUP: `${API_ENDPOINT}/user/signup`,
    API_LOGIN: `${API_ENDPOINT}/user/login`,
    API_USER: `${API_ENDPOINT}/user`,
    API_USER_UPDATE_TOKEN: `${API_ENDPOINT}/user/updateToken`,
    API_USER_NOTIFIED: `${API_ENDPOINT}/user/setNotified`,

    // LOTGEN
    API_NUM_LIST: `${API_ENDPOINT}/lottery/list`,
    API_SAVE_NUM: `${API_ENDPOINT}/lottery/save`,
    API_FAME_LIST: `${API_ENDPOINT}/lottery/fame`,

    //PLANNER
    API_PLANNER_LIST: `${API_ENDPOINT}/planner/list`,
    API_PLANNER_SAVE: `${API_ENDPOINT}/planner/save`,
    API_PLANNER_DELETE: `${API_ENDPOINT}/planner/delete`,
    API_PLANNER_LATEST: `${API_ENDPOINT}/planner/latest`,

    //ARTICLE
    API_ARTICLE_LIST: `${API_ENDPOINT}/article/list`,
    API_ARTICLE: `${API_ENDPOINT}/article`,
    API_ARTICLE_SAVE: `${API_ENDPOINT}/article/save`,
    API_ARTICLE_COMMENT_SAVE: `${API_ENDPOINT}/article/comment/save`,

    //FILE
    API_FILE_UPLOAD_SINGLE: `${API_ENDPOINT}/file/upload/single`,
    API_FILE_REMOVE_SINGLE: `${API_ENDPOINT}/file/remove/single`,
}

export default Constants
