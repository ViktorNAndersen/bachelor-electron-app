$(document).ready(function() {
    window.addEventListener('online', () => window.electron.send('check-api-status'));
    window.addEventListener('offline', () => window.electron.send('check-api-status'));

    $(document).on('click', '.router', function () {
        const route = $(this).data('route');
        if (route) {
            console.log("Requesting route:", route);
            window.electron.send('request-route', route);
        }
    });

    window.electron.receive('route-response', (data) => {
        window.electron.removeAllListeners('data-response');
        $('.temp').remove();
        $('#content').html(data.content);
        if (data.scriptPath) {
            createScript(data.scriptPath, data.id);
        }
    });

    window.electron.receive('api-status', (event) => {
        if (event.status) {
            handleNetworkStatusChange(true)
        } else {
            handleNetworkStatusChange(false)
        }
    });
});


function createScript(src, id) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => console.log(`${src} was loaded successfully`);
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    script.classList.add('temp');
    if (id !== null) {
        script.setAttribute('data-id', id); // Embed the ID into the script element
    }
    document.body.appendChild(script); // Append the script tag to the body or head as needed
}

function handleNetworkStatusChange(status) {
    let statusElement = $('#network-status');
    statusElement.text(status ? 'Online' : 'Offline');
    statusElement.removeClass('text-danger text-success');
    statusElement.addClass(status ? 'text-success' : 'text-danger');
    if(status) {
        window.electron.send('process-queue');
    }
}