const API_ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://psyho.pw:3000/api' : 'http://localhost:4000/api'

const Constants = {
    // USER
    API_SIGNUP: `${API_ENDPOINT}/signup`,
    API_LOGIN: `${API_ENDPOINT}/login`,
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
}

export default Constants
