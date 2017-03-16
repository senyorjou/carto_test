class Map {
    constructor(url, canvas, context) {
        this.baseUrl = url;
        this.canvas = canvas;
        this.context = context;
        this.bgColor = '#345';
        this.shapes = [];
        this.bounds = {};
        this.scale = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.zoom = 20;
        this.zoomTick = 2;
        this.relX = -3000;
        this.relY = -5000;
        this.hasBounds = false;
        this.boundsfn = this.initBounds;

        setControls(this);
    }

    initBounds(shape) {
      this.bounds.maxX = shape.bounds.maxX;
      this.bounds.minX = shape.bounds.minX;
      this.bounds.maxY = shape.bounds.maxY;
      this.bounds.minY = shape.bounds.minY;
      this.boundsfn = this.checkBounds;
    }

    checkBounds(shape) {
      if (shape.bounds.maxX > this.bounds.maxX) this.bounds.maxX = shape.bounds.maxX;
      if (shape.bounds.minX < this.bounds.minX) this.bounds.minX = shape.bounds.minX;
      if (shape.bounds.maxY > this.bounds.maxY) this.bounds.maxY = shape.bounds.maxY;
      if (shape.bounds.minY < this.bounds.minY) this.bounds.minY = shape.bounds.minY;
    }

    addShape(shape) {
        this.shapes.push(shape);
        this.boundsfn(shape)
    }

    calcScale() {
        var xScale = this.width / Math.abs(this.bounds.maxX - this.bounds.minX);
        var yScale = this.height / Math.abs(this.bounds.maxY - this.bounds.minY);

        this.scale = xScale < yScale ? xScale : yScale;
    }

    clearCanvas() {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = this.bgColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.restore();
    }

    draw() {
        this.clearCanvas();

        let scaleXzoom = this.scale * this.zoom;
        let shiftX = this.bounds.minX + this.relX;
        let centerX = (this.width / 2) - (Math.abs((this.bounds.maxX - this.bounds.minX) / 2) * scaleXzoom);

        let shiftY = this.bounds.maxY + this.relY;
        let centerY = (this.height / 2) - (Math.abs((this.bounds.maxY - this.bounds.minY) / 2) * scaleXzoom);

        let center = new Point(centerX, centerY);
        let shift = new Point(shiftX, shiftY);

        let activeShapes = [];

        for (var i = 0; i < this.shapes.length; i++) {
            // Check if shape is inside frame
            var minX = ((this.shapes[i].bounds.minX - shiftX) * scaleXzoom) + centerX;
            var maxX = ((this.shapes[i].bounds.maxX - shiftX) * scaleXzoom) + centerX;
            var minY = ((shiftY - this.shapes[i].bounds.minY) * scaleXzoom) + centerY;
            var maxY = ((shiftY - this.shapes[i].bounds.maxY) * scaleXzoom) + centerY;

            if (minX > this.width || maxX < 0 ||
                minY > this.height || maxY < 0 ) {
                continue; /// nope, skip his one
            }
            this.context.fillStyle = this.shapes[i].color;

            for (var j = 0; j < this.shapes[i].path.length - 1; j++) {
                var x = ((this.shapes[i].path[j].X - shiftX) * scaleXzoom) + centerX;
                var y = ((shiftY - this.shapes[i].path[j].Y) * scaleXzoom) + centerY;

                if (j === 0) {
                    this.context.beginPath();
                    this.context.moveTo(x, y);

                } else {
                    this.context.lineTo(x, y);
                }

                this.context.stroke();
                this.context.fill();

            }
            activeShapes.push(i);
        }
        fillTable(this, activeShapes);
    };

    load() {
        // first get row count
        var url = this.baseUrl + '?q=select count(*) from public.mnmappluto';
        var self = this;
        loadJSON(url, function(response) {
            var totalRows = JSON.parse(response)['rows'][0]['count'];
            var chunk = 4000;
            var chunksQueue = [];
            var queryString = '?format=GeoJSON&q=select cartodb_id, the_geom, address, assessland from public.mnmappluto';

            for (var i = 0; i < totalRows; i += chunk) {
                chunksQueue.push(baseUrl + queryString + ' limit ' + chunk + ' offset ' + i)
            }

            self.loadChunks(chunksQueue);
        });
    }

    loadChunks(queue) {
        var url = queue.shift();
        var _this = this;

        loadJSON(url, function(response) {
            JSON.parse(response).features.forEach(function(el) {
                if (el.geometry.type === "MultiPolygon") {
                    _this.addShape(new Shape(el.geometry.coordinates[0][0],
                                            el.properties));
                }
            });
            _this.calcScale();
            _this.draw();
            //return;
            if (queue.length > 0) {
                _this.loadChunks(queue);
            }
        });
    }
}
