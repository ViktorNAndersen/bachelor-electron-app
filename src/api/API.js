const axios = require("axios");
const { API_USERS_PATH } = require( "../common/constants");

function getAPIUserData() {
    console.log(axios)
    return axios.get(API_USERS_PATH).then(response => response.data);
}

module.exports = { getAPIUserData };