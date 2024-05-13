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
            event.reply('queue-updated', this.getQueue());
        });

        ipcMain.on('clear-queue', (event) => {
            this.clearQueue();
            event.reply('queue-cleared', { success: true });
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

    clearQueue() {
        //this.store.clear(); // Clear the store
        this.queue = []; // Clear the queue array
        this.store.set('actionQueue', this.queue); // Update the store
        console.log("Queue cleared");
    }
}

module.exports = new QueueManager();  // Export as a singleton instance

