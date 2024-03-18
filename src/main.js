const { app, BrowserWindow, ipcMain } = require('electron')
const { createWindow, handleRoute, navigate } = require('./window');
const { getAPIUserData } = require('./api/API');


const allowedRoutes = {
    'unit_show': 'unit/show.html',
    'unit_index': 'unit/index.html',
};

app.whenReady().then(() => {
    createWindow()

    ipcMain.on('request-route', (event, route) => {
        if (route in allowedRoutes) {
            console.log("Route allowed:", route)
            handleRoute(allowedRoutes[route], BrowserWindow.fromWebContents(event.sender));
        } else {
            console.error('Route not allowed:', route);
        }
    });

    //getAPIUserData().then(data => console.log(data));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})