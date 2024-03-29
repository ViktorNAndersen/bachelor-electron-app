$(document).ready(function() {
    // Request orders data from the main process
    window.electron.send('fetch-data', { type: 'orders' });

    // Listen for the data response
    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching orders:', response.error);
        } else {
            console.log('Orders data:', response.data);
            // You can now use response.data to populate the HTML as needed
        }
    });
});