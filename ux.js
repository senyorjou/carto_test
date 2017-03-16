// al UX related itemes here
function setCanvasProps(canvas) {
    canvas.width = 400;
    canvas.height = 600;
}

function setContextProps(ctx) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333';
}

function setControls(map) {
    var mouseDown = false;
    var bzoomIn = document.getElementById('button-zoomin');
    var bzoomOut = document.getElementById('button-zoomout');

    map.canvas.addEventListener('mousewheel', zoom, false);
    map.canvas.addEventListener('mousedown', setMouseDown, false);
    map.canvas.addEventListener('mouseup', setMouseUp, false);
    map.canvas.addEventListener('mousemove', move, false);

    bzoomIn.addEventListener('click', function(e) {
        zoomAction(map.zoomTick); }, false);
    bzoomOut.addEventListener('click', function(e) {
        zoomAction(-map.zoomTick); }, false);


    function zoomAction(level) {
        map.zoom += level;
        map.draw();
    }

    // Set the zoom with the mouse wheel
    function zoom(e) {
        var direction = e.wheelDelta > 0 ? 1 : -1;
        var amount = Math.abs(e.wheelDelta);
        var base = map.zoomTick;

        // Handle simple acceleration
        if (amount > 2000) {
            base *= 3;
        } else if (amount > 500) {
            base *= 2;
        }
        zoomAction(base * direction);
    }

    // Toggle mouse status
    function setMouseDown(e) {
        mouseDown = true;
        mousePos = [e.x, e.y];
        map.canvas.style.cursor = 'hand';
    }

    function setMouseUp(e) {
        mouseDown = false;
        map.canvas.style.cursor = 'crosshair';
    }

    // Move
    function move(e) {
        if (mouseDown) {
            var delta = [e.x - mousePos[0], e.y - mousePos[1]];
            map.relX -= delta[0] * 5;
            map.relY += delta[1] * 5;

            mousePos = [e.x, e.y];
            map.draw();
        }
    }
}


function fillTable(map, items) {
    let tableFooter = document.getElementById('table-footer');
    let tableBody = document.getElementById('data-table-body');
    let maxEls = 30;

    // Saturn method for removing childs
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    numRows = items.length > maxEls ? maxEls : items.length;
    for (var i = 0; i < numRows; i++) {
        var row = createRow(map.shapes[i]);
        tableBody.appendChild(row);
    }

    // Simple status
    if (items.length > maxEls) {
        tableFooter.innerHTML = 'Listing ' + maxEls +' elements out of ' + items.length;
    } else {
        tableFooter.innerHTML = '';
    }
}