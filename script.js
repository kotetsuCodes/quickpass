const {remote} = require('electron');
const {ipcRenderer} = require('electron');
// Module to handle clipboard

function toggleAutoPaste(checkBox) {

    if(checkBox.checked) {
        var msg = ipcRenderer.sendSync('enable-autopaste', 'Auto-Paste Enabled');
    } else {
        var msg = ipcRenderer.sendSync('disable-autopaste', 'Auto-Paste Disabled');
    }
}

function showNotification(parentElement, msg) {
    //create new node
    var notificationElement = document.createElement('span');
    notificationElement.textContent = msg;

    //append to checkbox
    insertAfter(notificationElement, parentElement);

    setTimeout(function() {
        notificationElement.parentNode.removeChild(notificationElement)
     }, 3000)
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}