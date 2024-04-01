$(document).ready(function() {
    const id = $('.temp').data('id');
    if (id) {
        location_show(id);
    } else {
        locations_index();
    }
});

function location_show(id){
    window.electron.send('fetch-data', { type: 'location', id: id });

    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching location:', response.error);
        } else {
            console.log('Location data:', response.data);
            fillLocation(response.data);
        }
    });
}

function fillLocation(location) {
    const detailsContainer = $('#location-details');
    let productsHtml = '', employeesHtml = '';

    location.quantities.forEach(item => {
        productsHtml += `
            <div class="col-md-4">
                <div class="card mb-4 box-shadow">
                    <div class="card-body">
                        <h5 class="card-title">${item.product.name}</h5>
                        <p class="card-text text-truncate text-muted"> ${item.product.description}</p>
                        <p class="card-text">Price: $${item.product.price}</p>
                    </div>
                    <div class="card-footer"> 
                        <small class="text-muted">Quantity: ${item.quantity}</small>  
                    </div>
                </div>
            </div>
        `;
    });

    location.employees.forEach(employee => {
        employeesHtml += `
            <li class="list-group-item">
                Employee#${employee.id}, ${employee.email}
            </li>
        `;
    });

    detailsContainer.html(`
        <div class="card mb-3">
            <div class="card-header">
                <h4>${location.name}</h4>
            </div>
            <div class="card-body">
                <h5 class="card-title">Address: ${location.address}</h5>
                <p class="card-text">Updated on: ${new Date(location.updated_at).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card mb-3">
                    <div class="card-header">Products</div>
                    <div class="card-body">
                        <div class="row">
                            ${productsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card mb-3">
                <div class="card-header">Employees</div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        ${employeesHtml}
                    </ul>
                </div>
            </div>
        </div>
    `);
}

function locations_index() {
    window.electron.send('fetch-data', { type: 'locations' });

    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching locations:', response.error);
        } else {
            console.log('Locations data:', response.data);
            fillUnits(response.data.units);
            fillSuppliers(response.data.suppliers);
        }
    });
}

function fillUnits(units) {
    const unitsList = $('#units-list');
    unitsList.empty();

    units.forEach(unit => {
        unitsList.append(`
            <tr>
                <td>${unit.name}</td>
                <td>${unit.address}</td>
                <td>
                    <button class="btn btn-primary router" data-route="location/${unit.id}">View</button>
                </td>
            </tr>
        `);
    });
}

function fillSuppliers(suppliers) {
    const suppliersList = $('#suppliers-list');
    suppliersList.empty();

    suppliers.forEach(supplier => {
        suppliersList.append(`
            <tr>
                <td>${supplier.name}</td>
                <td>${supplier.address}</td>
                <td>
                    <button class="btn btn-primary router" data-route="location/${supplier.id}">View</button>
                </td>
            </tr>
        `);
    });
}