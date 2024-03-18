$(document).ready(function() {
    $('.router').click(function() {
        const route = $(this).data('route');
        if (route) {
            console.log("Requesting route:", route);
            window.electron.send('request-route', route);
        }
    });

    window.electron.receive('route-response', (content) => {
        $('#content').html(content);
    });
});