let shapeColors = ['#FFFFCC', '#C7E9B4', '#7FCDBB', '#41B6C4', '#1D91C0',
                   '#225EA8', '#0C2C84']

class Point {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }

    displayPoint() {
        return this.X.toFixed(3) + ', ' + this.Y.toFixed(3)
    }
}

class Shape {
    constructor(coords, props) {
        var p = this.makePath(coords);
        this.path = p.path;
        this.bounds = p.bounds;
        this.props = props;
        this.color = shapeColors[this.props.assessland % 8]
    }

    makePath(coords) {
        let path = [];

        for (var i = 0; i < coords.length; i++) {
            var p = geo2Merc(coords[i][0], coords[i][1]);
            if (i === 0) {
                var maxX = p.X,
                    minX = p.X,
                    maxY = p.Y,
                    minY = p.Y;
            } else {
                maxX = p.X > maxX ? p.X : maxX;
                minX = p.X < minX ? p.X : minX;
                maxY = p.Y > maxY ? p.Y : maxY;
                minY = p.Y < minY ? p.Y : minY;
            }

            path.push(p);
        }

        return {path: path,
                bounds: {maxX: maxX, minX: minX, maxY: maxY, minY: minY}};
    }

    Address () {
        return this.props.address ? this.props.address : ''
    }

    Origin() {
        return this.path[0].displayPoint();
    }
}