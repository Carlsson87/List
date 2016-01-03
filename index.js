var io = require('socket.io-client');
var socket = io();
var $list = document.getElementById('List');
var $addBtn = document.getElementById('AddButton');

if (location.hash) {
    var listName = location.hash.slice(1);
}

// When connected, subscribe to the correct list.
socket.on('connect', function() {
    console.log('Connected');

    socket.emit('subscribe', listName);
    socket.on('subscribed', function(value) {
        console.log('Subscribed');
        render(value);
    });

    socket.on('updated list', function(value) {
        console.log('updated', value);
        render(value);
    });
});

// When the add-button is clicked.
$addBtn.addEventListener('click', function() {
    var string = prompt('What');
    var item = {
        text: string,
        done: false
    };
    socket.emit('add item', [listName, item]);
});

var currentList = null;
function render(list) {
    currentList = list;
    $list.innerHTML = '';
    console.log(list);
    list.forEach(function(item, index) {
        $list.appendChild(makeLi(item, index));
    });
}

function makeLi(item, index) {
    var li = document.createElement('li');
    li.classList.add('Item');
    if (item.done) {
        li.classList.add('done');
    }
    li.innerText = item.text;
    li.addEventListener('click', function() {
        socket.emit('toggle item', [listName, index]);
    });
    return li;
}

window.emptyList = function() {
    socket.emit('empty list', listName);
};