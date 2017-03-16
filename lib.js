// Helper functions

function createCell(value, align) {
    var cell = document.createElement('td');

    if (align !== undefined) {
        cell.style.textAlign = align;
    }

    var cellText = document.createTextNode(value);
    cell.appendChild(cellText);

    return cell;
}

function createRow(item) {
    var row = document.createElement('tr');

    row.appendChild(createCell(item.props.cartodb_id, 'right'));
    row.appendChild(createCell(item.Origin()));
    row.appendChild(createCell(item.Address()));
    row.appendChild(createCell(item.props.assessland));

    return row;
}

function geo2Merc(lon, lat) {
    var radius = 6378137; // Equator
    var max = 85.0511287798;
    var radians = Math.PI / 180;

    var x = radius * lon * radians;
    var y = Math.max(Math.min(max, lat), - max) * radians;
    y = radius * Math.log(Math.tan((Math.PI / 4) + (y / 2)));

    return new Point(x, y);
}

function loadJSON(uri, callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', uri, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}
