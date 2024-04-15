const { app, BrowserWindow, ipcMain } = require('electron')
const QueueManager = require('./QueueManager');
const { createWindow, handleRoute} = require('./window');
const { fetchUsers, fetchLocations, fetchOrders, fetchUser, fetchLocation, fetchOrder, fetchProducts, newOrder, updateOrderStatus, deleteOrder } = require('./api/API');

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

    //ORDERS CRUD
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
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})