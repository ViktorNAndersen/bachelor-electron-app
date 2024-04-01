$(document).ready(function() {
    window.electron.send('fetch-data', { type: 'products' });

    window.electron.receive('data-response', (response) => {
        if (response.error) {
            console.error('Error fetching products:', response.error);
        } else {
            console.log('Products data:', response.data);
        }
    });
});