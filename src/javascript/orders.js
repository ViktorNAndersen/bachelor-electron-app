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

    const updateButtonHtml = order.status === 'in_progress' ? `
        <button id="updateOrderButton" class="btn btn-success me-3">Mark as Completed</button>
    ` : '';

    const deleteButtonHtml = `
        <button id="deleteOrderButton" class="btn btn-danger">Delete Order</button>
    `;

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
            <div class="order-actions d-flex justify-content-end">
                ${updateButtonHtml} ${deleteButtonHtml}
            </div>
        </div>
    `);

    if (order.status === 'in_progress') {
        $('#updateOrderButton').on('click', () => {
            console.log("clicked update")
            updateOrderStatus(order.id, 'completed');
        });
    }

    $('#deleteOrderButton').on('click', () => {
        deleteOrder(order.id);
        console.log("clicked delete")
    });
}


function updateOrderStatus(id, newStatus) {
    window.electron.send('update-order', { id: id, status: newStatus });

    window.electron.receive('order-update-response', (response) => {
        if (response.error) {
            console.error('Error updating order status:', response.error);
        } else {
            console.log('Order status updated:', response.data);
        }
    });
}

function deleteOrder(id) {
    window.electron.send('delete-order', { id: id });

    window.electron.receive('order-delete-response', (response) => {
        if (response.error) {
            console.error('Error deleting order:', response.error);
        } else {
            console.log('Order deleted:', response.data);
        }
    });
}


