$(document).ready(function() {
    $(document).on('click', '.router', function() {
        const route = $(this).data('route');
        if (route) {
            console.log("Requesting route:", route);
            window.electron.send('request-route', route);
        }
    });

    window.electron.receive('route-response', (content) => {
        $('#content').html(content);

        // If you need to make sure something runs right after the content is loaded,
        // you could also trigger custom events or call functions here.
    });
});