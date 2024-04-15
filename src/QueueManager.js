const axios = require('axios');
const Store = require('electron-store');
const { fetchUpdatedData } = require('./api/API');

const store = new Store();

class QueueManager {
    static instance;

    constructor() {
        if (QueueManager.instance) {
            return QueueManager.instance;
        }
        QueueManager.instance = this;
    }

    async enqueue(task) {
        const tasks = store.get('tasks') || [];
        tasks.push(task);
        store.set('tasks', tasks);
    }

    async processQueue() {
        if (!onlineStatus()) return;

        let tasks = store.get('tasks') || [];
        while (tasks.length > 0) {
            const task = tasks.shift();
            try {
                await this.executeTask(task);
            } catch (error) {
                console.error('Failed to execute task:', task, error);
                tasks.unshift(task);
                break;
            }
        }
        store.set('tasks', tasks);
    }

    async executeTask(task) {
        const { type, url, data, cacheKey } = task;
        let response;
        switch (type) {
            case 'post':
                response = await axios.post(url, data);
                break;
            case 'put':
                response = await axios.put(url, data);
                break;
            case 'delete':
                response = await axios.delete(url);
                break;
            default:
                throw new Error('Unsupported task type');
        }
        if (cacheKey) {
            const freshData = await this.apiFunctions.fetchUpdatedData(cacheKey);
            await store.set(cacheKey, freshData);
        }
        return response.data;
    }

}

const apiFunctions = {
    fetchUpdatedData
};

const instance = new QueueManager(apiFunctions);
module.exports = instance;
