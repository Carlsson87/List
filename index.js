var io = require('socket.io-client');
var socket = io('http://localhost:3000');
var $list = document.getElementById('List');
var $addBtn = document.getElementById('AddButton');

function uid() {
    var text = 'abcdefghijklmnopqrstuvwxzy1234567890';
    var id = '';
    for (var i = 0; i < 5; i++) {
        id += text[Math.floor(Math.random() * text.length)];
    }
    return id;
}

var LIST = {
    empty: true
};

var LIST_NAME = null;

if (location.hash) {
    var listName = location.hash.slice(1);
    socket.emit('subscribe', listName);
    LIST_NAME = listName;
}

// When connected, subscribe to the correct list.
socket.on('connect', function() {
    console.log('Connected');
    socket.on('update-list', function(data) {
        console.log('Update list', data);
    });

    socket.on('subscribed', function() {
        socket.emit('update-list', LIST);
    });
});

// When the add-button is clicked.
$addBtn.addEventListener('click', function() {
    var string = prompt('What');
    var item = {
        text: string,
        done: false,
        dirty: true,
        node: null
    };
    LIST[Date.now()] = item;

    if (LIST_NAME === null && LIST.empty) {
        LIST_NAME = uid();
        socket.emit('create-list', { name: LIST_NAME, data: LIST });
        console.log('Created list: ' + LIST_NAME);
        LIST.empty = false;
    } else {
        socket.emit('update-list', { name: LIST_NAME, data: LIST });
    }

    render();
});

function render() {
    console.log('Rendering', LIST);

    for (var key in LIST) {
        if (key === 'empty' || !LIST[key].dirty) continue;

        if (LIST[key].node === null) {
            LIST[key].node = makeLi(LIST[key].text);
            $list.appendChild(LIST[key].node);
        }
    }
}

function makeLi(text) {
    var li = document.createElement('li');
    li.classList.add('Item');
    li.innerText = text;
    return li;
}