const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron', {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["request-route", "fetch-data", "new-order"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["route-response", "data-response", "order-response"];
            if (validChannels.includes(channel)) {
                const wrapper = (event, ...args) => func(...args)
                ipcRenderer.on(channel, wrapper);
            }
        },
        removeAllListeners: (channel) => {
            let validChannels = ["route-response", "data-response", "order-response"];
            if (validChannels.includes(channel)) {
                ipcRenderer.removeAllListeners(channel);
            }
        },
        getEnv: (varName) => process.env[varName]
    }
);