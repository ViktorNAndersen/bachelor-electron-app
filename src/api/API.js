const axios = require("axios");
const { API_USERS_PATH } = require( "../common/constants");

function fetchUsers() {
    return axios.get(API_USERS_PATH).then(response => response.data);
}

function fetchLocations() {
    return axios.get(API_LOCATIONS_PATH).then(response => response.data);
}

function fetchOrders() {
    return axios.get(API_ORDERS_PATH).then(response => response.data);
}

function fetchUser(user) {
    return axios.get(`${API_USERS_PATH}/${user}`).then(response => response.data);
}

function fetchLocation(location) {
    return axios.get(`${API_LOCATIONS_PATH}/${location}`).then(response => response.data);
}

function fetchOrder(order) {
    return axios.get(`${API_ORDERS_PATH}/${order}`).then(response => response.data);
}

module.exports = { fetchUsers, fetchLocations, fetchOrders, fetchUser, fetchLocation, fetchOrder};