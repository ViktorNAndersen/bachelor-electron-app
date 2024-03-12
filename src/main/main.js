const { app, BrowserWindow } = require('electron')
const { createWindow } = require('./window');
const { getAPIUserData } = require('../api/API');

app.whenReady().then(() => {
    createWindow()

    getAPIUserData().then(data => console.log(data));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})