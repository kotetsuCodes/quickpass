const {remote} = require('electron');
const {ipcRenderer} = require('electron');
// Module to handle clipboard

var hotKeyField = document.getElementById('hotKey')
var localStorageHotKey = window.localStorage.getItem('hotkey');
if(localStorageHotKey) {
    console.log('hotkey exists in local storage');
    ipcRenderer.sendSync('sethotkey', localStorageHotKey);
    hotKeyField.value = localStorageHotKey;
} else {
    console.log('hotkey does not exist in local storage')
    hotKeyField.value = ipcRenderer.sendSync('gethotkey', 'requesting current hotkey');    
}

var lastValidHotKey = hotKeyField.value;



function checkModifier (event) {
    var hotkeyStr = '';

    event.preventDefault();
    
    if(event.ctrlKey) {
        hotkeyStr += 'ctrl+';
    }
    if(event.shiftKey) {
        hotkeyStr += 'shift+';
    }

    if((event.ctrlKey || event.shiftKey) && /[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        hotkeyStr += String.fromCharCode(event.keyCode);

        if(hotkeyStr !== lastValidHotKey) {

            hotKeyField.value = hotkeyStr;
            lastValidHotKey = hotkeyStr;

            //send message to electron
            var msg = ipcRenderer.sendSync('sethotkey', hotkeyStr);
            window.localStorage.setItem('hotkey', hotkeyStr);    
        }
    } else {
        hotKeyField.value = lastValidHotKey;
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