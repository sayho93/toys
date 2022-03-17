const API_ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://psyho.pw:3000/api' : 'http://localhost:4000/api'

const Constants = {
    // USER
    API_SIGNUP: `${API_ENDPOINT}/signup`,
    API_LOGIN: `${API_ENDPOINT}/login`,
    API_USER: `${API_ENDPOINT}/user`,
    API_USER_UPDATE_TOKEN: `${API_ENDPOINT}/user/updateToken`,
    // LOTGEN
    API_NUM_LIST: `${API_ENDPOINT}/lottery/list`,
    API_SAVE_NUM: `${API_ENDPOINT}/lottery/save`,
    API_FAME_LIST: `${API_ENDPOINT}/lottery/fame`,
    //PLANNER
    API_PLANNER_LIST: `${API_ENDPOINT}/planner/list`,
}

export default Constants
