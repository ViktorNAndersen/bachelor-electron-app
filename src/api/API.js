const axios = require("axios");
const { API_USERS_PATH, API_LOCATIONS_PATH, API_ORDERS_PATH, API_PRODUCTS_PATH } = require( "../common/constants");

function fetchUsers() {
    return axios.get(API_USERS_PATH)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function fetchLocations() {
    return axios.get(API_LOCATIONS_PATH)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function fetchOrders() {
    return axios.get(API_ORDERS_PATH)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function fetchUser(user) {
    return axios.get(`${API_USERS_PATH}/${user}`)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function fetchLocation(location) {
    return axios.get(`${API_LOCATIONS_PATH}/${location}`)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function fetchOrder(order) {
    return axios.get(`${API_ORDERS_PATH}/${order}`)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function fetchProducts() {
    return axios.get(API_PRODUCTS_PATH)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function newOrder(params) {
    return axios.post(API_ORDERS_PATH, params)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function updateOrderStatus(order, status) {
    return axios.put(`${API_ORDERS_PATH}/${order}`, { status })
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });
}

function deleteOrder(order) {
    return axios.delete(`${API_ORDERS_PATH}/${order}`)
        .then(response => response.data)
        .catch(error => { throw new Error(error.response.data); });

}

module.exports = { fetchUsers, fetchLocations, fetchOrders, fetchUser, fetchLocation, fetchOrder, fetchProducts, newOrder, updateOrderStatus, deleteOrder };