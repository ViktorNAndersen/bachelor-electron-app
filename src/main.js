const { app, BrowserWindow, ipcMain } = require('electron')
const { createWindow, handleRoute} = require('./window');
const { fetchUsers, fetchLocations, fetchOrders, fetchUser, fetchLocation, fetchOrder, fetchProducts, newOrder, updateOrderStatus, deleteOrder, seedCache, checkApiStatus } = require('./api/API');
const { queueManager } = require('./api/QueueManager');

const allowedRoutes = {
    'location': 'locations/show.html',
    'locations': 'locations/index.html',
    'order': 'orders/show.html',
    'orders': 'orders/index.html',
    'user': 'users/show.html',
    'users': 'users/index.html',
    'new_order': 'orders/new.html',
};

app.whenReady().then(() => {
    createWindow()
    seedCache();

    checkApi();
    setAPICheckInterval();

    ipcMain.on('request-route', (event, route) => {
        const [baseRoute, id] = route.split('/');

        if (baseRoute in allowedRoutes) {
            handleRoute(allowedRoutes[baseRoute], BrowserWindow.fromWebContents(event.sender), id);
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
                case 'products':
                    responseData = await fetchProducts();
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

    ipcMain.on('new-order', async (event, orderData) => {
        try {
            await newOrder(orderData);
            await handleRoute('orders/index.html', BrowserWindow.fromWebContents(event.sender), null);
        } catch (error) {
            console.error('Order creation failed');
        }
    });

    ipcMain.on('update-order', async (event, { id, status }) => {
        try {
            await updateOrderStatus(id, status);
            await handleRoute('orders/index.html', BrowserWindow.fromWebContents(event.sender), null);
        } catch (error) {
            console.error('Order update failed');
        }
    });

    ipcMain.on('delete-order', async (event, { id }) => {
        try {
            await deleteOrder(id);
            await handleRoute('orders/index.html', BrowserWindow.fromWebContents(event.sender), null);
        } catch (error) {
            console.error('Order deletion failed');
        }
    });

    ipcMain.on('check-api-status' , async (event) => {
        try {
            const status = await checkApiStatus();
            event.sender.send('api-status', { status: status });
        } catch (error) {
            console.error('Error checking API status:', error);
            event.sender.send('api-status', { status: false });
        }
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function setAPICheckInterval(){
    setInterval( () => checkApi(), 5000);
}

async function checkApi(){
    try {
        const status = await checkApiStatus();
        // Send status to all renderer windows
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('api-status', { status: status });
        });
    } catch (error) {
        console.error('Error checking API status:', error);
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('api-status', { status: false });
        });
    }
}