$(document).ready(function() {
    $(document).on('click', '.router', function() {
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