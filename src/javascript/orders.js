$(document).ready(function() {
    // Request orders data from the main process
    window.electron.send('fetch-data', { type: 'orders' });

    // Listen for the data response
    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching orders:', response.error);
        } else {
            console.log('Orders data:', response.data);
            fillOrders(response.data);
            // You can now use response.data to populate the HTML as needed
        }
    });
});

//Create a fill orders function
function fillOrders(orders) {
    const ordersList = $('#ordersList');
    ordersList.empty(); // Clear existing entries

    // Dynamically create and append table rows for each order
    orders.forEach(order => {
        ordersList.append(`
            <tr>
                <td>${order.id}</td>
                <td>${order.status}</td>
                <td>${order.total_price}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-primary router" data-route="order/${order.id}">View</button>
                </td>
            </tr>
        `);
    });
}