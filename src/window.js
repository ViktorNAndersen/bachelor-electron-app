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
        }
    });

    win.loadFile('src/index.html');
    win.webContents.openDevTools()

}

function handleRoute(route, win) {
    const routePath = path.join(__dirname, 'renderer', route);
    fs.readFile(routePath, 'utf-8', (error, content) => {
        if (error) {
            console.error('Error reading file:', error);
            return;
        }
        win.webContents.send('route-response', content);
    });
}


module.exports = { createWindow, handleRoute };