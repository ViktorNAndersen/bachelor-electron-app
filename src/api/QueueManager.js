const { ipcMain, BrowserWindow } = require('electron');
const Store = require('electron-store');

class QueueManager {
    constructor() {
        if (QueueManager.instance) {
            return QueueManager.instance;
        }

        this.store = new Store();
        this.queue = this.store.get('actionQueue') || [];
        this.setupIpcListeners();

        QueueManager.instance = this;
        return this;
    }

    setupIpcListeners() {
        ipcMain.on('get-queue', (event) => {
            console.log("GOT QUEUE")
            event.reply('queue-updated', this.getQueue());
        });
    }

    enqueue(action, data) {
        console.log("ENQUEUED" + { action, data })
        this.queue.push({ action, data });
        this.store.set('actionQueue', this.queue);
    }

    getQueue() {
        return this.queue;
    }
}

module.exports = new QueueManager();  // Export as a singleton instance

