const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron', {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["request-route", "fetch-data"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["route-response", "data-response"];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);