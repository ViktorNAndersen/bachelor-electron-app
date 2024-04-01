$(document).ready(function() {
    const id = $('.temp').data('id');
    if (id) {
        orders_show(id);
    } else {
        orders_index();
    }
});

function orders_index() {
    window.electron.send('fetch-data', { type: 'orders' });

    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching orders:', response.error);
        } else {
            console.log('Orders data:', response.data);
            fillOrders(response.data);
        }
    });
}

function fillOrders(orders) {
    const ordersList = $('#orders-list');
    ordersList.empty();

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

function orders_show(id){
    window.electron.send('fetch-data', { type: 'order', id: id });

    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching order:', response.error);
        } else {
            console.log('Order data:', response.data);
            fillOrder(response.data);
        }
    });
}

function fillOrder(order) {
    const detailsContainer = $('#order-details');
    let orderItemsHtml = '';

    order.order_items.forEach(item => {
        orderItemsHtml += `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.product.price}</td>
                <td>$${(item.quantity * parseFloat(item.product.price)).toFixed(2)}</td>
            </tr>
        `;
    });

    detailsContainer.html(`
        <div class="card shadow-sm">
            <div class="card-header bg-dark-subtle">
                <h3 class="mb-0">Order ID: ${order.id}</h3>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Status: <strong>${order.status}</strong></li>
                <li class="list-group-item">Total Price: <strong>$${order.total_price}</strong></li>
                <li class="list-group-item">Order Date: <strong>${new Date(order.created_at).toLocaleDateString()}</strong></li>
            </ul>
            <div class="table-responsive m-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItemsHtml}
                    </tbody>
                </table>
            </div>
            <div class="card-footer text-muted">
                Ordered by: <span class="ml-2">User #${order.ordered_by_id}</span><br>
                Order Updated on: ${new Date(order.updated_at).toLocaleDateString()}
            </div>
        </div>
    `);
}



