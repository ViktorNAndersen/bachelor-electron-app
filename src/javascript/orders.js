$(document).ready(function() {
    const id = $('.temp').data('id');
    if (id) {
        orders_show(id);
    } else {
        orders_index();
    }

    window.electron.send('get-queue');

    window.electron.receive('queue-updated', (queue) => {
        displayQueue(queue);
    });
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
            confirm("Are you sure you want to do update this order?")
            console.log("clicked update")
            updateOrderStatus(order.id, 'completed');
        });
    }

    $('#deleteOrderButton').on('click', () => {
        confirm("Are you sure you want to delete this order?")
        deleteOrder(order.id);
        console.log("clicked delete")
    });
}


function updateOrderStatus(id, newStatus) {
    window.electron.send('update-order', { id: id, status: newStatus });
}

function deleteOrder(id) {
    window.electron.send('delete-order', { id: id });
}

function displayQueue(queue) {
    const queueContainer = document.getElementById('queue-container');
    queueContainer.innerHTML = ''; // Clear previous contents

    if (queue.length === 0) {
        queueContainer.innerHTML = '<div class="alert alert-info">No pending actions.</div>';
        return;
    }

    const card = document.createElement('div');
    card.className = 'card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = 'Pending Actions';
    card.appendChild(cardHeader);

    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group list-group-flush';

    queue.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';

        const actionDescription = document.createElement('p');
        actionDescription.className = 'mb-1';
        actionDescription.textContent = `Action: ${item.action}`;

        const dataDescription = document.createElement('small');
        dataDescription.textContent = `URL: ${item.data.url} - Data: ${JSON.stringify(item.data.params)}`;

        listItem.appendChild(actionDescription);
        listItem.appendChild(dataDescription);
        listGroup.appendChild(listItem);
    });

    card.appendChild(listGroup);
    queueContainer.appendChild(card);
}


