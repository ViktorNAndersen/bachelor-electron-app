const { net } = require('electron');

function onlineStatus() {
    return net.isOnline();
}

module.exports = { onlineStatus };