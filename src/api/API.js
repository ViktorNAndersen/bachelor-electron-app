const axios = require("axios");
const Store = require("electron-store");
const { onlineStatus } = require('./utils');
const { API_USERS_PATH, API_LOCATIONS_PATH, API_ORDERS_PATH, API_PRODUCTS_PATH } = require("../common/constants");

const store = new Store();

async function fetchData(url, cacheKey) {
    try {
        if (onlineStatus()) {
            const response = await axios.get(url);
            const data = response.data;
            store.set(cacheKey, data);
            return data;
        } else {
            const cachedData = store.get(cacheKey);
            if (cachedData) {
                return cachedData;
            }
            throw new Error('No network connection and no cached data available.');
        }
    } catch (error) {
        const cachedData = store.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        throw new Error(error.message || 'Failed to fetch data.');
    }
}


async function postData(url, params) {
    try {
        if (onlineStatus()) {
            const response = await axios.post(url, params);
            return response.data;
        } else {
            new Error('No network connection. Action queued.');
        }
    } catch (error) {
        throw new Error(`Error: ${error.response.data}, Status Code: ${error.response.status}`);
    }
}

async function putData(url, data) {
    try {
        if (onlineStatus()) {
            const response = await axios.put(url, data);
            return response.data;
        } else {
            new Error('No network connection. Action queued.');
        }
    } catch (error) {
        throw new Error(error.message || `Error: ${error.response?.data}, Status Code: ${error.response?.status}`);
    }
}

async function deleteData(url) {
    try {
        if (onlineStatus()) {
            const response = await axios.delete(url);
            return response.data;
        } else {
            new Error('No network connection. Action queued.');
        }
    } catch (error) {
        throw new Error(error.message || `Error: ${error.response?.data}, Status Code: ${error.response?.status}`);
    }
}

async function seedCache()  {
    if (onlineStatus()) { // Ensure you have a method to reliably check the network status
        try {
            await fetchUsers();
            await fetchLocations();
            const orders = await fetchOrders();
            await fetchProducts();
            console.log('Cache seeded with users, locations, products.');

            await Promise.all(orders.map(async (order) => {
                try {
                    const detailedOrder = await fetchOrder(order.id);
                    console.log(`Detailed data fetched for order ${order.id}`);
                } catch (error) {
                    console.error(`Failed to fetch detailed data for order ${order.id}:`, error);
                }
            }));
            console.log('All detailed orders data fetched.');
        } catch (error) {
            console.error('Failed to seed cache:', error);
        }
    } else {
        console.log('No internet connection - cache not seeded');
    }
}

function fetchUsers() { return fetchData(API_USERS_PATH, 'users');}
function fetchLocations() { return fetchData(API_LOCATIONS_PATH, 'locations'); }
function fetchOrders() { return fetchData(API_ORDERS_PATH, 'orders'); }
function fetchUser(user) { return fetchData(`${API_USERS_PATH}/${user}`, 'users'); }
function fetchLocation(location) { return fetchData(`${API_LOCATIONS_PATH}/${location}`, 'locations'); }
function fetchOrder(order) { return fetchData(`${API_ORDERS_PATH}/${order}`, `order-${order}`); }
function fetchProducts() { return fetchData(API_PRODUCTS_PATH, 'products'); }
function newOrder(params) { return postData(API_ORDERS_PATH, params); }
function updateOrderStatus(order, status) { return putData(`${API_ORDERS_PATH}/${order}`, { status }); }
function deleteOrder(order) { return deleteData(`${API_ORDERS_PATH}/${order}`); }

module.exports = { fetchUsers, fetchLocations, fetchOrders, fetchUser, fetchLocation, fetchOrder, fetchProducts, newOrder, updateOrderStatus, deleteOrder, seedCache};