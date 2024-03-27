const { app, BrowserWindow, ipcMain } = require('electron')
const { createWindow, handleRoute, navigate } = require('./window');
const { getAPIUserData } = require('./api/API');


const allowedRoutes = {
    'location': 'locations/show.html',
    'locations': 'locations/index.html',
    'order': 'orders/show.html',
    'orders': 'orders/index.html',
    'user': 'users/show.html',
    'users': 'users/index.html',
};

app.whenReady().then(() => {
    createWindow()

    ipcMain.on('request-route', (event, route) => {
        if (route in allowedRoutes) {
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