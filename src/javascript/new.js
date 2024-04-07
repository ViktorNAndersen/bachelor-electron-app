$(document).ready(function() {
    set_unit_supplier();
    window.electron.send('fetch-data', { type: 'products' });

    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching products:', response.error);
        } else {
            console.log('Products data:', response.data);
            fillProductForm(response.data);
        }
    });
});

function set_unit_supplier() {
    const unit = window.electron.getEnv('CURRENT_UNIT')
    const supplier = window.electron.getEnv('CURRENT_SUPPLIER')
    $('#unit_name').text(unit);
    $('#supplier_name').text(supplier);
}

function fillProductForm(products) {
    const container = $('#products-container');
    container.empty(); // Clear previous entries if any

    products.forEach(product => {
        const productInputHtml = `
            <div class="form-group">
                <label for="product-${product.id}">${product.name} ($${product.price})</label>
                <input type="number" class="form-control" id="product-${product.id}" name="product-${product.id}" placeholder="Enter amount">
            </div>
        `;
        container.append(productInputHtml);
    });
}

$('#create-order-form').on('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting through the browser

    let user_id = window.electron.getEnv('CURRENT_USER_ID');
    let orderData = {
        order: {
            ordered_by_id: user_id,
            order_items_attributes: []
        }
    };

    $('#products-container .form-group input').each(function() {
        const productId = $(this).attr('id').replace('product-', '');
        const quantity = $(this).val();

        if (quantity > 0) { // Assuming you only want to include products with a specified quantity
            orderData.order.order_items_attributes.push({
                product_id: productId,
                quantity: quantity
            });
        }
    });

    window.electron.send('new-order', orderData);
});
