const { app, BrowserWindow, ipcMain } = require('electron')
const { createWindow, handleRoute, navigate } = require('./window');
const { fetchUsers, fetchLocations, fetchOrders, fetchUser, fetchLocation, fetchOrder } = require('./api/API');

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

    ipcMain.on('fetch-data', async (event, data) => {
        const { type, id } = data;
        try {
            let responseData = null;
            switch (type) {
                case 'user':
                    responseData = await fetchUser(id);
                    break;
                case 'location':
                    responseData = await fetchLocation(id);
                    break;
                case 'order':
                    responseData = await fetchOrder(id);
                    break;
                case 'users':
                    responseData = await fetchUsers();
                    break;
                case 'locations':
                    responseData = await fetchLocations();
                    break;
                case 'orders':
                    responseData = await fetchOrders();
                    break;
                default:
                    console.error('Invalid type:', type);
                    event.sender.send('data-response', { error: 'Invalid type' });
                    return;
            }
            event.sender.send('data-response', { data: responseData });
        } catch (error) {
            console.error("Error fetching: ", data, error);
            event.sender.send('data-response', { error: error.message });
        }
    });

    fetchOrders().then(data => console.log(data));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})