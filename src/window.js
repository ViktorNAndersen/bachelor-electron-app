const { BrowserWindow } = require('electron');
const path  = require("path");
const fs = require("fs");

function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });

    win.loadFile('src/index.html');
    win.webContents.openDevTools()
}

const routeScriptMap = {
    'locations/index.html': 'locations.js',
    'locations/show.html': 'locations.js',
    'orders/index.html': 'orders.js',
    'orders/show.html': 'orders.js',
    'users/index.html': 'users.js',
    'users/show.html': 'users.js',
    'orders/new.html': 'new.js',
}

function handleRoute(route, win, id=null) {
    const routePath = path.join(__dirname, 'renderer', route);
    fs.readFile(routePath, 'utf-8', (error, content) => {
        if (error) {
            console.error('Error reading file:', error);
            return;
        }
        const scriptPath = routeScriptMap[route] ? `javascript/${routeScriptMap[route]}` : "";

        win.webContents.send('route-response', { content, scriptPath, id});
    });
}

module.exports = { createWindow, handleRoute };