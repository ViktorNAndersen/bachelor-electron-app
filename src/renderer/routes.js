$(document).ready(function() {
    $(document).on('click', '.router', function() {
        const route = $(this).data('route');
        if (route) {
            console.log("Requesting route:", route);
            window.electron.send('request-route', route);
        }
    });

    window.electron.receive('route-response', (data) => {
        $('#content').html(data.content);
        
        if (data.scriptPath) {
            const script = document.createElement('script');
            script.src = data.scriptPath;
            script.onload = () => console.log(`${data.scriptPath} was loaded successfully`);
            script.onerror = () => console.error(`Failed to load script: ${data.scriptPath}`);
            document.body.appendChild(script); // Append the script tag to the body or head as needed
        }
    });
});