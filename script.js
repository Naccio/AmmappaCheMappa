"use strict";
class MapRenderer {
    mapAccessor;
    layers;
    constructor(mapAccessor, layers) {
        this.mapAccessor = mapAccessor;
        this.layers = layers;
    }
    render() {
        const map = this.mapAccessor.map, canvas = document.createElement('canvas');
        canvas.width = map.columns * map.pixelsPerCell;
        canvas.height = map.rows * map.pixelsPerCell;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const drawer = new CanvasDrawer(canvas);
        for (let layer of this.layers) {
            layer.render(drawer);
        }
        return canvas;
    }
}
class Export {
    renderer;
    label;
    constructor(renderer, localizer) {
        this.renderer = renderer;
        this.label = localizer['command_label_export'];
    }
    execute() {
        const map = this.renderer.render();
        Utilities.download('map.png', map.toDataURL());
    }
}
class Open {
    mapLoader;
    label;
    constructor(mapLoader, localizer) {
        this.mapLoader = mapLoader;
        this.label = localizer['command_label_open'];
    }
    execute() {
        Utilities.loadFile((f) => this.readFile(f));
    }
    readFile(file) {
        const map = Utilities.parseMap(file);
        this.mapLoader.load(map);
    }
}
class ModalLauncher {
    localizer;
    confirmValue = 'confirm';
    constructor(localizer) {
        this.localizer = localizer;
    }
    launchForm(title, content, confirmCallback, cancelCallback) {
        const dialog = document.createElement('dialog'), header = document.createElement('header'), body = document.createElement('div'), footer = document.createElement('footer'), form = document.createElement('form'), h1 = document.createElement('h1'), close = document.createElement('button'), cancel = document.createElement('button'), confirm = document.createElement('button');
        form.method = 'dialog';
        h1.innerText = title;
        close.type = 'button';
        close.innerText = 'x';
        close.tabIndex = -1;
        close.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };
        header.append(h1);
        header.append(close);
        body.className = 'dialog-body';
        for (let element of content) {
            body.append(element);
        }
        confirm.innerText = this.localizer['button_label_confirm'];
        confirm.value = this.confirmValue;
        cancel.innerText = this.localizer['button_label_cancel'];
        cancel.formNoValidate = true;
        footer.append(confirm);
        footer.append(cancel);
        form.append(header);
        form.append(body);
        form.append(footer);
        dialog.append(form);
        dialog.onclose = () => {
            if (dialog.returnValue === this.confirmValue) {
                confirmCallback();
            }
            else if (cancelCallback !== undefined) {
                cancelCallback();
            }
            dialog.remove();
        };
        document.body.append(dialog);
        dialog.showModal();
    }
}
class New {
    mapFactory;
    mapLoader;
    modal;
    localizer;
    label;
    constructor(mapFactory, mapLoader, modal, localizer) {
        this.mapFactory = mapFactory;
        this.mapLoader = mapLoader;
        this.modal = modal;
        this.localizer = localizer;
        this.label = localizer['command_label_new'];
    }
    execute() {
        const columnsInput = document.createElement('input'), columnsLabel = document.createElement('label'), rowsInput = document.createElement('input'), rowsLabel = document.createElement('label'), title = this.localizer['form_title_new_map'];
        columnsInput.id = 'columns';
        columnsInput.type = 'number';
        columnsInput.min = '5';
        columnsInput.max = '100';
        columnsInput.value = '20';
        columnsInput.required = true;
        columnsLabel.htmlFor = columnsInput.id;
        columnsLabel.innerText = this.localizer['input_label_columns'];
        rowsInput.id = 'rows';
        rowsInput.type = 'number';
        rowsInput.min = '5';
        rowsInput.max = '100';
        rowsInput.value = '20';
        columnsInput.required = true;
        rowsLabel.htmlFor = rowsInput.id;
        rowsLabel.innerText = this.localizer['input_label_rows'];
        this.modal.launchForm(title, [columnsLabel, columnsInput, rowsLabel, rowsInput], () => {
            const columns = parseInt(columnsInput.value), rows = parseInt(rowsInput.value), map = this.mapFactory.create(columns, rows);
            this.mapLoader.load(map);
        });
    }
}
class Save {
    mapAccessor;
    label;
    constructor(mapAccessor, localizer) {
        this.mapAccessor = mapAccessor;
        this.label = localizer['command_label_save'];
    }
    execute() {
        const json = JSON.stringify(this.mapAccessor.map), content = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json);
        Utilities.download('map.json', content);
    }
}
class CanvasDrawer {
    canvas;
    context;
    constructor(canvas) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (context === null) {
            throw new Error('Cannot get canvas 2D context.');
        }
        this.context = context;
    }
    get height() {
        return this.canvas.height;
    }
    get width() {
        return this.canvas.width;
    }
    bezier(from, to, control1, control2, style) {
        const ignoreBorders = style.ignoreBorders ?? false, padding = ignoreBorders ? undefined : style.lineWidth ?? 1;
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, to.x, to.y);
        this.setLineStyle(style);
        this.context.stroke();
        this.context.restore();
    }
    clear(point, width, height) {
        const x = point?.x ?? 0, y = point?.y ?? 0;
        width ??= this.canvas.width;
        height ??= this.canvas.height;
        this.context.clearRect(x, y, width, height);
    }
    circle(point, radius, style) {
        const fillStyle = style.fillStyle ?? '#fff';
        this.context.save();
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.context.fill();
        if (style.line !== undefined) {
            this.setLineStyle(style.line);
            this.context.stroke();
        }
        this.context.restore();
    }
    ellipse(point, radiusX, radiusY, rotation, style) {
        const fillStyle = style.fillStyle ?? '#fff';
        this.context.save();
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.ellipse(point.x, point.y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        this.context.fill();
        if (style.line !== undefined) {
            this.setLineStyle(style.line);
            this.context.stroke();
        }
        this.context.restore();
    }
    image(drawer) {
        this.context.drawImage(drawer.canvas, 0, 0);
    }
    line(points, style) {
        const mapPoints = [...points], start = mapPoints.shift();
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        mapPoints.forEach(p => this.context.lineTo(p.x, p.y));
        this.setLineStyle(style);
        this.context.stroke();
        this.context.restore();
    }
    scale(scale) {
        const canvas = this.canvas;
        canvas.style.width = canvas.width * scale + 'px';
        canvas.style.height = canvas.height * scale + 'px';
    }
    text(point, text, fontSize) {
        this.context.save();
        this.context.font = fontSize + 'px serif';
        const measurement = this.context.measureText(text), width = measurement.width, x = point.x - width / 2, y = point.y;
        this.context.fillText(text, x, y);
        this.context.restore();
    }
    setLineStyle(style) {
        const lineCap = style?.lineCap ?? 'square', lineJoin = style?.lineJoin ?? 'round', lineWidth = style?.lineWidth ?? 1, color = style?.color ?? '#000';
        this.context.lineCap = lineCap;
        this.context.lineJoin = lineJoin;
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
    }
}
class CellDrawer {
    cellIndex;
    mapAccessor;
    drawer;
    constructor(cellIndex, mapAccessor, drawer) {
        this.cellIndex = cellIndex;
        this.mapAccessor = mapAccessor;
        this.drawer = drawer;
    }
    get cell() {
        return this.mapAccessor.getCell(this.index);
    }
    get index() {
        return this.cellIndex;
    }
    get map() {
        return this.mapAccessor.map;
    }
    get pixelsPerCell() {
        return this.map.pixelsPerCell;
    }
    bezier(from, to, control1, control2, style) {
        const ignoreBorders = style.ignoreBorders ?? false, padding = ignoreBorders ? undefined : style.lineWidth ?? 1;
        from = this.cellPointToMapPoint(from, padding);
        to = this.cellPointToMapPoint(to, padding);
        control1 = this.cellPointToMapPoint(control1, padding);
        control2 = this.cellPointToMapPoint(control2, padding);
        this.drawer.bezier(from, to, control1, control2, style);
    }
    clear() {
        const pixels = this.pixelsPerCell, cell = this.cellIndex, point = {
            x: cell.column * pixels,
            y: cell.row * pixels,
        };
        this.drawer.clear(point, pixels, pixels);
    }
    circle(point, radius, style) {
        radius *= this.pixelsPerCell;
        point = this.cellPointToMapPoint(point, radius + 2);
        this.drawer.circle(point, radius, style);
    }
    ellipse(point, radiusX, radiusY, rotation, style) {
        radiusX *= this.pixelsPerCell;
        radiusY *= this.pixelsPerCell;
        const padding = {
            x: radiusX + 2,
            y: radiusY + 2
        };
        point = this.cellPointToMapPoint(point, padding);
        this.drawer.ellipse(point, radiusX, radiusY, rotation, style);
    }
    line(points, style) {
        const ignoreBorders = style.ignoreBorders ?? false, padding = ignoreBorders ? undefined : style.lineWidth ?? 1, mapPoints = points.map(p => this.cellPointToMapPoint(p, padding));
        this.drawer.line(mapPoints, style);
    }
    text(point, text, fontSize) {
        point = this.cellPointToMapPoint(point, undefined);
        fontSize *= this.pixelsPerCell;
        this.drawer.text(point, text, fontSize);
    }
    cellPointToMapPoint = (point, padding) => {
        const pixels = this.pixelsPerCell, cellShift = this.mapAccessor.getPosition(this.index);
        point = VectorMath.multiply(point, pixels);
        if (padding !== undefined) {
            let paddingX = 0, paddingY = 0;
            if (typeof padding === 'number') {
                paddingX = padding;
                paddingY = padding;
            }
            else {
                paddingX = padding.x;
                paddingY = padding.y;
            }
            point = {
                x: MathHelper.clamp(point.x, paddingX, pixels - paddingX),
                y: MathHelper.clamp(point.y, paddingY, pixels - paddingY)
            };
        }
        return VectorMath.add(point, cellShift);
    };
}
class GenericObjectRenderer {
    render(object, drawer) {
        if (this.is(object)) {
            this.draw(object, drawer);
        }
    }
}
class MountainsRenderer extends GenericObjectRenderer {
    lineWidth = 4;
    is(object) {
        return MountainsHelper.isMountain(object);
    }
    draw(mountain, drawer) {
        const halfWidth = mountain.width / 2, height = mountain.height, position = mountain.position, p1 = {
            x: position.x - halfWidth,
            y: position.y
        }, p2 = {
            x: position.x,
            y: position.y - height,
        }, p3 = {
            x: position.x + halfWidth,
            y: position.y
        };
        drawer.line([p1, p2, p3], {
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: this.lineWidth
        });
    }
}
class CellDrawerFactory {
    mapAccessor;
    canvasProvider;
    constructor(mapAccessor, canvasProvider) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
    }
    create(cell, layer) {
        const canvas = this.canvasProvider.get(layer);
        return new CellDrawer(cell, this.mapAccessor, canvas);
    }
}
class CellRenderer {
    drawerFactory;
    renderers;
    constructor(drawerFactory, renderers) {
        this.drawerFactory = drawerFactory;
        this.renderers = renderers;
    }
    render(cell, layer) {
        const drawer = this.drawerFactory.create(cell, layer), objects = drawer.cell.objects.filter(o => o.layer === layer);
        drawer.clear();
        for (let object of objects) {
            this.renderObject(object, drawer);
        }
    }
    renderObject(object, drawer) {
        for (let strategy of this.renderers) {
            strategy.render(object, drawer);
        }
    }
}
class MapAccessor {
    _map;
    _cells = [];
    get map() {
        if (this._map === undefined) {
            throw new Error('No map active');
        }
        return this._map;
    }
    set map(map) {
        this._map = map;
        this.save();
        for (let column = 0; column < map.columns; column++) {
            this._cells[column] = [];
            for (let row = 0; row < map.rows; row++) {
                this._cells[column][row] = {
                    coordinates: { column, row },
                    objects: []
                };
            }
        }
        for (let key in map.objects) {
            const index = GridHelper.cellNameToIndex(key), cell = this._cells[index.column][index.row];
            cell.objects = map.objects[key];
        }
    }
    get scale() {
        return this.map.zoom / this.map.pixelsPerCell;
    }
    absolutePosition(cell, normalizedPosition) {
        const cellPosition = {
            x: cell.column,
            y: cell.row
        };
        return VectorMath
            .startOperation(normalizedPosition)
            .add(cellPosition)
            .divide(this.scale);
    }
    getCell(index) {
        return this._cells[index.column][index.row];
    }
    getIndex(position) {
        if (position === undefined) {
            return undefined;
        }
        const map = this.map, cell = VectorMath.multiply(position, this.scale), column = Math.floor(cell.x), row = Math.floor(cell.y);
        if (row < 0 || row >= map.rows || column < 0 || column >= map.columns) {
            return undefined;
        }
        return { column, row };
    }
    getIndexes(from, to) {
        const fromCell = this.getIndex(from), toCell = this.getIndex(to);
        if (fromCell === undefined || toCell === undefined) {
            return [];
        }
        if (fromCell.column == toCell.column && fromCell.row === toCell.row) {
            return [fromCell];
        }
        return this.getConnectingCells(fromCell, toCell);
    }
    getPosition(index) {
        const shift = {
            x: index.column,
            y: index.row
        };
        return VectorMath.multiply(shift, this.map.pixelsPerCell);
    }
    getConnectingCells(from, to) {
        const columnDifference = to.column - from.column, rowDifference = to.row - from.row, columnDirection = Math.sign(columnDifference), rowDirection = Math.sign(rowDifference), columnDistance = Math.abs(columnDifference), rowDistance = Math.abs(rowDifference), cells = [];
        let column = from.column, row = from.row;
        if (columnDistance > rowDistance) {
            this.splitActionsEvenly(columnDistance, rowDistance, () => {
                row += 1 * rowDirection;
            }, () => {
                column += 1 * columnDirection;
                cells.push({ column, row });
            });
        }
        else {
            this.splitActionsEvenly(rowDistance, columnDistance, () => {
                column += 1 * columnDirection;
            }, () => {
                row += 1 * rowDirection;
                cells.push({ column, row });
            });
        }
        return cells;
    }
    normalizedPosition(cell, absolutePosition) {
        const cellPosition = {
            x: cell.column,
            y: cell.row
        };
        return VectorMath
            .startOperation(absolutePosition)
            .multiply(this.scale)
            .subtract(cellPosition);
    }
    setObjects(index, objects) {
        const cell = this._cells[index.column][index.row], cellName = GridHelper.cellIndexToName(index);
        if (objects.length === 0) {
            delete this.map.objects[cellName];
        }
        else {
            this.map.objects[cellName] = objects;
        }
        cell.objects = objects;
        this.save();
    }
    save() {
        localStorage.setItem('map', JSON.stringify(this._map));
    }
    splitActionsEvenly(numerator, denominator, splitAction, mainAction) {
        const quotient = Math.floor(numerator / denominator);
        let remainder = denominator === 0 ? numerator : numerator % denominator, remainderSpacing = denominator / remainder, remainderCounter = 0;
        for (let i = 0; i < denominator; i++) {
            let iterations = quotient;
            if (remainder > 0 && remainderCounter < i) {
                iterations += 1;
                remainder -= 1;
                remainderCounter += remainderSpacing;
            }
            splitAction();
            for (let j = 0; j < iterations; j++) {
                mainAction();
            }
        }
        for (let i = 0; i < remainder; i++) {
            mainAction();
        }
    }
}
class CellTool {
    mapAccessor;
    lastCell;
    lastPosition;
    constructor(mapAccessor) {
        this.mapAccessor = mapAccessor;
    }
    start(position) {
        this.guardedUse(position);
    }
    move(position) {
        if (position !== undefined) {
            this.guardedUse(position);
        }
    }
    stop(position) {
        if (position !== undefined) {
            this.guardedUse(position);
        }
        this.lastCell = undefined;
        this.lastPosition = undefined;
    }
    guardedUse(position) {
        const cell = this.mapAccessor.getIndex(position);
        if (cell !== undefined && !GridHelper.cellIsEqual(cell, this.lastCell)) {
            if (this.lastPosition === undefined) {
                this.useOnCell(cell);
            }
            else {
                const cells = this.mapAccessor.getIndexes(this.lastPosition, position);
                for (let cell of cells) {
                    this.useOnCell(cell);
                }
            }
        }
        this.lastCell = cell;
        this.lastPosition = position;
    }
}
class GridHelper {
    static quadrantShift = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ];
    static cellIndexToName(index) {
        const name = this.columnNumberToName(index.column + 1);
        return name + (index.row + 1);
    }
    static cellIsEqual(cell1, cell2) {
        return cell1?.column === cell2?.column && cell1?.row === cell2?.row;
    }
    static cellNameToIndex(name) {
        const splitName = name.split(/([0-9]+)/), column = this.columnNameToNumber(splitName[0]) - 1, row = parseInt(splitName[1]) - 1;
        return { column, row };
    }
    static columnNameToNumber(name) {
        let number = 0;
        name = name.toUpperCase();
        for (let i = 0; i < name.length; i++) {
            const charCode = name.charCodeAt(i);
            number *= 26;
            number += charCode - 64;
        }
        return number;
    }
    static columnNumberToName(number) {
        let name = '';
        while (number > 0) {
            const modulo = (number - 1) % 26;
            name = String.fromCharCode(65 + modulo) + name;
            number = Math.floor((number - modulo) / 26);
        }
        return name;
    }
    static getConnection(cell, from, direction) {
        const distantTo = VectorMath.multiply(direction, 1000), line = { from, to: distantTo }, top = { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, right = { from: { x: 1, y: 0 }, to: { x: 1, y: 1 } }, bottom = { from: { x: 0, y: 1 }, to: { x: 1, y: 1 } }, left = { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } };
        let to = VectorMath.lineIntersection(line, top), nextCell = undefined, nextFrom = undefined;
        if (from.y !== 0 && to !== undefined) {
            to.y = 0;
            nextCell = { column: cell.column, row: cell.row - 1 };
            nextFrom = { x: to.x, y: 1 };
            return [to, nextCell, nextFrom];
        }
        to = VectorMath.lineIntersection(line, right);
        if (from.x !== 1 && to !== undefined) {
            to.x = 1;
            nextCell = { column: cell.column + 1, row: cell.row };
            nextFrom = { x: 0, y: to.y };
            return [to, nextCell, nextFrom];
        }
        to = VectorMath.lineIntersection(line, bottom);
        if (from.y !== 1 && to !== undefined) {
            to.y = 1;
            nextCell = { column: cell.column, row: cell.row + 1 };
            nextFrom = { x: to.x, y: 0 };
            return [to, nextCell, nextFrom];
        }
        to = VectorMath.lineIntersection(line, left);
        if (from.x !== 0 && to !== undefined) {
            to.x = 0;
            nextCell = { column: cell.column - 1, row: cell.row };
            nextFrom = { x: 1, y: to.y };
            return [to, nextCell, nextFrom];
        }
        throw new Error('Could not find next connection.');
    }
    static isBottom(quadrant) {
        return quadrant === 2 || quadrant === 3;
    }
    static isLeft(quadrant) {
        return quadrant === 0 || quadrant === 2;
    }
    static isRight(quadrant) {
        return quadrant === 1 || quadrant === 3;
    }
    static isTop(quadrant) {
        return quadrant === 0 || quadrant === 1;
    }
}
class MathHelper {
    static clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }
    static nearestPower(x, base) {
        return Math.pow(base, this.nearestRoot(x, base));
    }
    static nearestRoot(x, degree) {
        return Math.ceil(Math.log(x) / Math.log(degree));
    }
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }
    static round(number, decimalPlaces) {
        const multiplier = Math.pow(10, decimalPlaces);
        return Math.round(number * multiplier) / multiplier;
    }
}
class VectorMath {
    static zero = {
        x: 0,
        y: 0
    };
    static add(v1, v2) {
        return new VectorCalculator(v1.x + v2.x, v1.y + v2.y);
    }
    static angle(v1, v2) {
        v1 = this.normalize(v1);
        v2 = this.normalize(v2);
        return Math.acos(this.dotProduct(v1, v2));
    }
    static clamp(v, min, max) {
        return new VectorCalculator(MathHelper.clamp(v.x, min, max), MathHelper.clamp(v.y, min, max));
    }
    static direction(v1, v2) {
        return this.subtract(v2, v1).normalize();
    }
    static divide(v, number) {
        return new VectorCalculator(v.x / number, v.y / number);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static invert(v) {
        return this.multiply(v, -1);
    }
    static isEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
    static lineIntersection(line1, line2) {
        const p1 = line1.from, p2 = line1.to, p3 = line2.from, p4 = line2.to, x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y, x4 = p4.x, y4 = p4.y, denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        if (this.isEqual(p1, p2) || this.isEqual(p3, p4)) {
            return undefined;
        }
        if (denominator === 0) {
            return undefined;
        }
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator, ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return undefined;
        }
        return {
            x: x1 + ua * (x2 - x1),
            y: y1 + ua * (y2 - y1)
        };
    }
    static magnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    static multiply(v, number) {
        return new VectorCalculator(v.x * number, v.y * number);
    }
    static normalize(v) {
        const m = this.magnitude(v);
        return this.divide(v, m);
    }
    static rotate(v, rad) {
        const cos = Math.cos(rad), sin = Math.sin(rad);
        return new VectorCalculator(cos * v.x - sin * v.y, sin * v.x + cos * v.y);
    }
    static round(v, decimalPlaces) {
        return new VectorCalculator(MathHelper.round(v.x, decimalPlaces), MathHelper.round(v.y, decimalPlaces));
    }
    static startOperation(v) {
        return new VectorCalculator(v.x, v.y);
    }
    static subtract(v1, v2) {
        return new VectorCalculator(v1.x - v2.x, v1.y - v2.y);
    }
}
class MountainFactory {
    create(quadrant) {
        const M = MathHelper, scale = quadrant === undefined ? 1 : .5, width = M.round(M.random(.8, .9) * scale, 2), height = M.round(M.random(.5, .8) * scale, 2), x = M.random(.4, .6) * scale, y = M.random(.8, 1) * scale, position = VectorMath
            .startOperation(GridHelper.quadrantShift[quadrant ?? 0])
            .multiply(scale)
            .add({ x, y })
            .round(2);
        return {
            type: MountainsHelper.objectType,
            layer: 'terrain',
            position,
            width,
            height
        };
    }
}
class MountainsHelper {
    static objectType = 'mountain';
    static getMountains(cell) {
        return cell.objects.filter(o => this.isMountain(o));
    }
    static isMountain(object) {
        return object.type === this.objectType;
    }
}
class MountainsTool extends CellTool {
    mountainFactory;
    renderer;
    id = 'mountains';
    labelResourceId = 'tool_label_mountains';
    constructor(mapAccessor, mountainFactory, renderer) {
        super(mapAccessor);
        this.mountainFactory = mountainFactory;
        this.renderer = renderer;
    }
    useOnCell(cell) {
        const mountains = [];
        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const mountain = this.mountainFactory.create(quadrant);
            mountains.push(mountain);
        }
        this.mapAccessor.setObjects(cell, mountains);
        this.renderer.render(cell, 'terrain');
    }
}
class PlacesHelper {
    static layer = 'terrain';
    static objectType = 'place';
    static getPlaces(cell) {
        return cell.objects.filter(o => this.isPlace(o));
    }
    static isPlace(object) {
        return object.type === this.objectType;
    }
}
class PlaceRenderer extends GenericObjectRenderer {
    draw(place, drawer) {
        const iconSize = .25, radius = iconSize / 2, center = place.position;
        drawer.circle(center, radius, {
            fillStyle: '#000'
        });
    }
    is(object) {
        return PlacesHelper.isPlace(object);
    }
}
class PlacesTool {
    mapAccessor;
    renderer;
    id = 'places';
    labelResourceId = 'tool_label_places';
    constructor(mapAccessor, renderer) {
        this.mapAccessor = mapAccessor;
        this.renderer = renderer;
    }
    start(point) {
        const cell = this.mapAccessor.getIndex(point);
        if (cell === undefined) {
            return;
        }
        const layer = PlacesHelper.layer, normalizedPosition = this.mapAccessor.normalizedPosition(cell, point), position = VectorMath.round(normalizedPosition, 2), place = {
            type: PlacesHelper.objectType,
            layer,
            position
        };
        this.mapAccessor.setObjects(cell, [place]);
        this.renderer.render(cell, layer);
    }
    move() {
    }
    stop() {
    }
}
class RiversHelper {
    static layer = 'terrain';
    static objectType = 'river';
    static isRiver(object) {
        return object.type === this.objectType;
    }
}
class RiverRenderer extends GenericObjectRenderer {
    lineWidth = 6;
    is(object) {
        return RiversHelper.isRiver(object);
    }
    draw(river, drawer) {
        const from = river.from, to = river.to, style = {
            lineWidth: this.lineWidth,
            ignoreBorders: true
        };
        drawer.bezier(from, to, river.bend1, river.bend2, style);
    }
}
class RiversTool {
    mapAccessor;
    renderer;
    id = 'rivers';
    labelResourceId = 'tool_label_rivers';
    startPosition;
    activeCell;
    constructor(mapAccessor, renderer) {
        this.mapAccessor = mapAccessor;
        this.renderer = renderer;
    }
    start(position) {
        const cell = this.mapAccessor.getIndex(position);
        if (cell === undefined) {
            return;
        }
        this.startPosition = position;
        this.activeCell = cell;
    }
    move(position) {
        const activeCell = this.activeCell, cell = this.mapAccessor.getIndex(position);
        if (this.startPosition === undefined || activeCell === undefined || position === undefined || cell === undefined) {
            return;
        }
        if (!GridHelper.cellIsEqual(activeCell, cell)) {
            const cells = this.createRivers(activeCell, this.startPosition, cell, position), river = this.getRiver(cell), cellPosition = this.mapAccessor.getPosition(cell);
            for (let cell of cells) {
                this.renderer.render(cell, 'terrain');
            }
            this.startPosition = VectorMath.startOperation(river.from)
                .multiply(this.mapAccessor.map.pixelsPerCell)
                .add(cellPosition)
                .divide(this.mapAccessor.map.zoom);
            this.activeCell = cell;
        }
        else {
            const river = this.getRiver(cell);
            if (river === undefined) {
                const from = this.mapAccessor.normalizedPosition(cell, this.startPosition), to = this.mapAccessor.normalizedPosition(cell, position);
                this.createRiver(cell, from, to);
            }
            else {
                river.to = VectorMath.round(this.mapAccessor.normalizedPosition(cell, position), 4);
                this.mapAccessor.setObjects(cell, [river]);
                this.startPosition = this.mapAccessor.absolutePosition(cell, river.from);
            }
            this.renderer.render(cell, 'terrain');
        }
    }
    stop() {
        this.startPosition = undefined;
        this.activeCell = undefined;
    }
    createRivers(firstCell, start, lastCell, end) {
        const normalizedStart = this.mapAccessor.normalizedPosition(firstCell, start), direction = VectorMath.direction(start, end), cells = [firstCell];
        let cell = firstCell, from = normalizedStart, previous = this.getRiver(firstCell), [to, nextCell, nextFrom] = GridHelper.getConnection(cell, from, direction);
        do {
            cells.push(cell);
            cell = nextCell;
            from = nextFrom;
            [to, nextCell, nextFrom] = GridHelper.getConnection(cell, from, direction);
            previous = this.createRiver(cell, from, to, previous);
        } while (!GridHelper.cellIsEqual(cell, lastCell));
        return cells;
    }
    createRiver(cell, from, to, previous) {
        let bend1 = {
            x: MathHelper.random(.2, .8),
            y: MathHelper.random(.2, .8)
        };
        if (previous !== undefined) {
            bend1 = VectorMath.startOperation(previous.bend2)
                .direction(previous.to)
                .multiply(MathHelper.random(.2, .5))
                .add(from);
        }
        const river = {
            type: RiversHelper.objectType,
            layer: 'terrain',
            from: VectorMath.round(from, 4),
            to: VectorMath.round(to, 4),
            bend1: VectorMath.round(bend1, 2),
            bend2: {
                x: MathHelper.round(MathHelper.random(.2, .8), 2),
                y: MathHelper.round(MathHelper.random(.2, .8), 2)
            }
        };
        this.mapAccessor.setObjects(cell, [river]);
        return river;
    }
    getRiver(cell) {
        return this.mapAccessor.getCell(cell).objects[0];
    }
}
class RoadRenderer extends GenericObjectRenderer {
    lineWidth = 2;
    is(object) {
        return object.type === 'road';
    }
    draw(road, drawer) {
        const from = road.from, to = road.to, direction = VectorMath.direction(from, to), shift1 = direction.multiply(.025).rotate(Math.PI / 2), from1 = shift1.add(from), to1 = shift1.add(to), shift2 = shift1.invert(), from2 = shift2.add(from), to2 = shift2.add(to), style = {
            lineWidth: this.lineWidth,
            ignoreBorders: true
        };
        drawer.line([from1, to1], style);
        drawer.line([from2, to2], style);
    }
}
class RoadsTool {
    ui;
    mapAccessor;
    renderer;
    id = 'roads';
    labelResourceId = 'tool_label_roads';
    startPosition;
    constructor(ui, mapAccessor, renderer) {
        this.ui = ui;
        this.mapAccessor = mapAccessor;
        this.renderer = renderer;
    }
    start(position) {
        const cell = this.mapAccessor.getIndex(position);
        this.ui.drawer.clear();
        if (cell === undefined) {
            return;
        }
        this.startPosition = position;
    }
    move(position) {
        const cell = this.mapAccessor.getIndex(position);
        this.ui.drawer.clear();
        if (this.startPosition === undefined || position === undefined || cell === undefined) {
            return;
        }
        const zoom = this.mapAccessor.map.zoom, from = VectorMath.multiply(this.startPosition, zoom), to = VectorMath.multiply(position, zoom);
        this.ui.drawer.line([from, to], {
            lineWidth: 5,
            color: '#0D0'
        });
    }
    stop(position) {
        const firstCell = this.mapAccessor.getIndex(this.startPosition), lastCell = this.mapAccessor.getIndex(position);
        this.ui.drawer.clear();
        if (this.startPosition === undefined || firstCell === undefined || position === undefined || lastCell === undefined) {
            return;
        }
        const cells = this.createRoads(firstCell, this.startPosition, lastCell, position);
        for (let cell of cells) {
            this.renderer.render(cell, 'terrain');
        }
        this.startPosition = undefined;
    }
    createRoads(firstCell, start, lastCell, end) {
        const normalizedStart = this.mapAccessor.normalizedPosition(firstCell, start), normalizedEnd = this.mapAccessor.normalizedPosition(lastCell, end), direction = VectorMath.direction(start, end), cells = [firstCell];
        let cell = firstCell, from = normalizedStart, to, nextCell = lastCell, nextFrom;
        while (!GridHelper.cellIsEqual(cell, lastCell)) {
            [to, nextCell, nextFrom] = GridHelper.getConnection(cell, from, direction);
            this.createRoad(cell, from, to);
            cell = nextCell;
            from = nextFrom;
            cells.push(nextCell);
        }
        this.createRoad(cell, from, normalizedEnd);
        return cells;
    }
    createRoad(cell, from, to) {
        const road = {
            type: 'road',
            layer: 'terrain',
            from: VectorMath.round(from, 4),
            to: VectorMath.round(to, 4)
        };
        this.mapAccessor.setObjects(cell, [road]);
    }
}
class TextRenderer extends GenericObjectRenderer {
    lineWidth = 2;
    is(object) {
        return object.type === TextHelper.objectType;
    }
    draw(text, drawer) {
        drawer.text(text.position, text.value, text.fontSize);
    }
}
class Localizer {
    constructor(resource) {
        Object.assign(this, resource);
    }
}
class TextHelper {
    static layer = 'text';
    static objectType = 'text';
    static isPlace(object) {
        return object.type === this.objectType;
    }
}
class TextTool {
    mapAccessor;
    renderer;
    modal;
    localizer;
    id = 'text';
    labelResourceId = 'tool_label_text';
    constructor(mapAccessor, renderer, modal, localizer) {
        this.mapAccessor = mapAccessor;
        this.renderer = renderer;
        this.modal = modal;
        this.localizer = localizer;
    }
    start(point) {
        const cell = this.mapAccessor.getIndex(point);
        if (cell === undefined) {
            return;
        }
        const textInput = document.createElement('input'), textLabel = document.createElement('label'), sizeInput = document.createElement('input'), sizeLabel = document.createElement('label'), title = this.localizer['form_title_new_text'];
        textInput.id = 'text';
        textInput.type = 'text';
        textInput.required = true;
        textLabel.htmlFor = textInput.id;
        textLabel.innerText = this.localizer['input_label_text'];
        sizeInput.id = 'size';
        sizeInput.type = 'number';
        sizeInput.min = '5';
        sizeInput.max = '100';
        sizeInput.value = '10';
        textInput.required = true;
        sizeLabel.htmlFor = sizeInput.id;
        sizeLabel.innerText = this.localizer['input_label_size'];
        this.modal.launchForm(title, [textLabel, textInput, sizeLabel, sizeInput], () => {
            const fontSize = parseInt(sizeInput.value) / 100, layer = TextHelper.layer, normalizedPosition = this.mapAccessor.normalizedPosition(cell, point), position = VectorMath.round(normalizedPosition, 2), text = {
                type: TextHelper.objectType,
                layer,
                position,
                value: textInput.value,
                fontSize
            };
            this.mapAccessor.setObjects(cell, [text]);
            this.renderer.render(cell, layer);
        });
    }
    move() {
    }
    stop() {
    }
}
class TreeRenderer extends GenericObjectRenderer {
    lineWidth = 2;
    is(object) {
        return TreesHelper.isTree(object);
    }
    draw(tree, drawer) {
        const position = tree.position, radiusX = tree.crownWidth / 2, radiusY = tree.crownHeight / 2, trunkTop = {
            x: position.x,
            y: position.y - tree.trunkHeight
        }, crownCenter = {
            x: position.x,
            y: trunkTop.y - tree.crownHeight / 2
        }, lineStyle = {
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: this.lineWidth
        };
        drawer.line([position, trunkTop], lineStyle);
        drawer.ellipse(crownCenter, radiusX, radiusY, 0, {
            line: lineStyle
        });
    }
}
class TreesHelper {
    static objectType = 'tree';
    static create() {
        const crownWidth = MathHelper.random(.4, .6), height = MathHelper.random(.8, .95), crownTrunkRatio = MathHelper.random(.2, .35), trunkHeight = height * crownTrunkRatio, crownHeight = height * (1 - crownTrunkRatio), position = {
            x: MathHelper.random(.35, .65),
            y: MathHelper.random(.8, 1)
        };
        return {
            type: TreesHelper.objectType,
            layer: 'terrain',
            position,
            crownWidth,
            crownHeight,
            trunkHeight
        };
    }
    static isTree(object) {
        return object.type === this.objectType;
    }
}
class TreesTool extends CellTool {
    renderer;
    id = 'trees';
    labelResourceId = 'tool_label_trees';
    constructor(mapAccessor, renderer) {
        super(mapAccessor);
        this.renderer = renderer;
    }
    useOnCell(cell) {
        const trees = [], perColumn = 6, perRow = 4, xScale = 1 / perColumn, yScale = 1 / perRow;
        for (let x = 0; x < perColumn; x++) {
            for (let y = 0; y < perRow; y++) {
                const tree = TreesHelper.create(), position = VectorMath.add({ x, y }, tree.position);
                tree.crownHeight = MathHelper.round(tree.crownHeight * yScale, 2);
                tree.crownWidth = MathHelper.round(tree.crownWidth * xScale, 2);
                tree.trunkHeight = MathHelper.round(tree.trunkHeight * yScale, 2);
                tree.position = {
                    x: MathHelper.round(position.x * xScale, 2),
                    y: MathHelper.round(position.y * yScale, 2)
                };
                trees.push(tree);
            }
        }
        this.mapAccessor.setObjects(cell, trees);
        this.renderer.render(cell, 'terrain');
    }
}
class ApplicationUI {
    elements;
    constructor(elements) {
        this.elements = elements;
    }
    build() {
        for (let element of this.elements) {
            element.build();
        }
    }
}
class MapDrawer {
    map;
    container;
    parentShift;
    actualShift = VectorMath.zero;
    currentShift = VectorMath.zero;
    constructor(map, container) {
        this.map = map;
        this.container = container;
        const parentShift = container.parentElement?.getBoundingClientRect();
        this.parentShift = parentShift === undefined
            ? VectorMath.zero
            : parentShift;
    }
    center() {
        this.shift(VectorMath.multiply(this.currentShift, -1));
    }
    getMapPoint(viewportPoint) {
        return VectorMath.subtract(viewportPoint, this.actualShift);
    }
    resize(direction) {
        const map = this.map, min = 1, max = 5, currentZoom = map.zoom, newZoom = MathHelper.clamp(currentZoom + direction, min, max), multiplier = map.pixelsPerCell / newZoom;
        map.zoom = newZoom;
        this.container.style.width = map.columns * multiplier + 'px';
        this.container.style.height = map.rows * multiplier + 'px';
        this.shift(VectorMath.zero);
    }
    shift(vector) {
        this.currentShift = VectorMath.add(this.currentShift, vector);
        this.actualShift = this.computeActualShift();
        const containerShift = VectorMath.subtract(this.actualShift, this.parentShift);
        this.container.style.left = containerShift.x + 'px';
        this.container.style.top = containerShift.y + 'px';
    }
    computeActualShift() {
        const shiftToCenter = {
            x: (window.innerWidth - this.container.clientWidth) / 2,
            y: (window.innerHeight - this.container.clientHeight) / 2
        };
        return VectorMath.add(this.currentShift, shiftToCenter);
    }
}
class DrawingArea {
    layers;
    tool;
    id = 'drawing-area';
    doubleClickThreshold = 250;
    _drawer;
    _wrapper;
    isShifting = false;
    isDrawing = false;
    lastShift = VectorMath.zero;
    lastWheelClick = 0;
    constructor(layers, tool) {
        this.layers = layers;
        this.tool = tool;
    }
    build() {
        const wrapper = document.createElement('div');
        wrapper.id = this.id;
        window.addEventListener('blur', this.blurHandler);
        wrapper.addEventListener('mousedown', this.mouseDownHandler);
        wrapper.addEventListener('mouseleave', this.mouseLeaveHandler);
        wrapper.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        wrapper.addEventListener('wheel', this.wheelHandler);
        document.body.append(wrapper);
        this._wrapper = wrapper;
    }
    setup(map) {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        this.wrapper.innerHTML = '';
        this.wrapper.append(container);
        this._drawer = new MapDrawer(map, container);
        this.drawer.resize(0);
        this.layers.forEach(l => l.setup(container));
        this.drawer.center();
    }
    get drawer() {
        if (this._drawer === undefined) {
            throw new Error('UI not built');
        }
        return this._drawer;
    }
    get wrapper() {
        if (this._wrapper === undefined) {
            throw new Error('UI not built');
        }
        return this._wrapper;
    }
    getMapPoint(point) {
        return this.drawer.getMapPoint(point);
    }
    startDraw(coordinates) {
        ;
        this.isDrawing = true;
        this.tool.start(coordinates);
    }
    startShift(coordinates) {
        this.isShifting = true;
        this.lastShift = coordinates;
    }
    stop(coordinates) {
        if (this.isDrawing) {
            this.tool.stop(coordinates);
            this.isDrawing = false;
        }
        this.isShifting = false;
    }
    updateShift(coordinates) {
        const shift = VectorMath.subtract(coordinates, this.lastShift);
        this.lastShift = coordinates;
        this.drawer.shift(shift);
    }
    zoom(direction) {
        this.drawer.resize(direction);
        this.layers.forEach(l => l.zoom());
    }
    blurHandler = () => {
        this.stop(undefined);
    };
    mouseDownHandler = (e) => {
        const coordinates = {
            x: e.clientX,
            y: e.clientY
        };
        if (Utilities.hasFlag(e.buttons, 4)) {
            const now = Date.now();
            if (now - this.lastWheelClick < this.doubleClickThreshold) {
                this.drawer.center();
            }
            this.lastWheelClick = now;
            this.startShift(coordinates);
        }
        else if (Utilities.hasFlag(e.buttons, 1)) {
            const mapCoordinates = this.getMapPoint(coordinates);
            this.startDraw(mapCoordinates);
        }
    };
    mouseLeaveHandler = () => {
        this.tool.move(undefined);
    };
    mouseMoveHandler = (e) => {
        const coordinates = {
            x: e.clientX,
            y: e.clientY
        };
        if (this.isShifting) {
            this.updateShift(coordinates);
        }
        else if (this.isDrawing) {
            const mapCoordinates = this.getMapPoint(coordinates);
            this.tool.move(mapCoordinates);
        }
    };
    mouseUpHandler = (e) => {
        const coordinates = this.getMapPoint({
            x: e.clientX,
            y: e.clientY
        });
        this.stop(coordinates);
    };
    wheelHandler = (e) => {
        const direction = Math.sign(e.deltaY);
        this.zoom(direction);
    };
}
class GridLayer {
    mapAccessor;
    canvasProvider;
    container;
    constructor(mapAccessor, canvasProvider) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
    }
    render(drawer) {
        this.renderAtScale(drawer, this.mapAccessor.map.pixelsPerCell);
    }
    setup(container) {
        const drawer = this.canvasProvider.create('grid', container.clientWidth, container.clientHeight), map = this.mapAccessor.map, spacing = map.pixelsPerCell / map.zoom;
        this.renderAtScale(drawer, spacing);
        this.container = container;
        container.append(drawer.canvas);
    }
    zoom() {
        if (this.container === undefined) {
            return;
        }
        this.setup(this.container);
    }
    renderAtScale(drawer, spacing) {
        const map = this.mapAccessor.map, style = {
            color: '#999',
            lineWidth: 2
        };
        for (let i = 0; i < map.columns + 1; i++) {
            const x = i * spacing, y1 = 0, y2 = drawer.height;
            drawer.line([{ x, y: y1 }, { x, y: y2 }], style);
        }
        for (let i = 0; i < map.rows + 1; i++) {
            const y = i * spacing, x1 = 0, x2 = drawer.width;
            drawer.line([{ x: x1, y }, { x: x2, y }], style);
        }
    }
}
class CanvasProvider {
    canvases = {};
    create(id, width, height, scale) {
        const canvas = document.createElement('canvas'), drawer = new CanvasDrawer(canvas);
        scale ??= 1;
        document.getElementById(id)?.remove();
        canvas.id = id;
        canvas.width = width;
        canvas.height = height;
        this.canvases[id] = drawer;
        this.scale(id, scale);
        document.body.append(canvas);
        return drawer;
    }
    scale(id, scale) {
        this.canvases[id]?.scale(scale);
    }
    get(id) {
        return this.canvases[id];
    }
}
class UILayer {
    mapAccessor;
    canvasProvider;
    id = 'ui';
    _drawer;
    constructor(mapAccessor, canvasProvider) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
    }
    get drawer() {
        if (this._drawer === undefined) {
            throw new Error('UI not initialized.');
        }
        return this._drawer;
    }
    render() {
    }
    setup(container) {
        const map = this.mapAccessor.map, drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);
        container.append(drawer.canvas);
        this._drawer = drawer;
    }
    zoom() {
        this._drawer?.scale(1 / this.mapAccessor.map.zoom);
    }
}
class TextLayer {
    mapAccessor;
    canvasProvider;
    renderer;
    id = 'text';
    drawer;
    constructor(mapAccessor, canvasProvider, renderer) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
        this.renderer = renderer;
    }
    render(drawer) {
        if (this.drawer === undefined) {
            return;
        }
        this.draw();
        drawer.image(this.drawer);
    }
    setup(container) {
        const map = this.mapAccessor.map, drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);
        container.append(drawer.canvas);
        this.drawer = drawer;
        this.draw();
    }
    zoom() {
        this.drawer?.scale(1 / this.mapAccessor.map.zoom);
    }
    draw() {
        const map = this.mapAccessor.map;
        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderer.render({ column, row }, this.id);
            }
        }
    }
}
class TerrainLayer {
    mapAccessor;
    canvasProvider;
    renderer;
    id = 'terrain';
    drawer;
    constructor(mapAccessor, canvasProvider, renderer) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
        this.renderer = renderer;
    }
    render(drawer) {
        if (this.drawer === undefined) {
            return;
        }
        this.draw();
        drawer.image(this.drawer);
    }
    setup(container) {
        const map = this.mapAccessor.map, drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);
        container.append(drawer.canvas);
        this.drawer = drawer;
        this.draw();
    }
    zoom() {
        this.drawer?.scale(1 / this.mapAccessor.map.zoom);
    }
    draw() {
        const map = this.mapAccessor.map;
        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderer.render({ column, row }, this.id);
            }
        }
    }
}
class ButtonMenuEntry {
    label;
    action;
    constructor(label, action) {
        this.label = label;
        this.action = action;
    }
    build() {
        const button = document.createElement('button');
        button.innerText = this.label;
        button.onclick = () => this.action();
        return button;
    }
}
class CommandMenuEntry extends ButtonMenuEntry {
    constructor(command) {
        super(command.label, () => command.execute());
    }
}
class LocalizationHelper {
    static storageKey = 'locale';
    static languages = [{
            locale: "en",
            name: "English"
        }, {
            locale: "it",
            name: "Italiano"
        }];
    static getUserLocale() {
        let locale = localStorage.getItem(this.storageKey);
        if (locale === null) {
            locale = new Intl.Locale(navigator.language).language;
        }
        return this.isValid(locale) ? locale : this.languages[0].locale;
    }
    static isValid(locale) {
        return this.languages.find(l => l.locale === locale) !== undefined;
    }
    static async loadResource(locale) {
        const response = await fetch(`resources/${locale}.json`);
        const json = await response.json();
        return json;
    }
    static storeUserLocale(locale) {
        if (this.isValid(locale)) {
            localStorage.setItem(this.storageKey, locale);
        }
    }
}
class LanguageMenuEntry extends ButtonMenuEntry {
    language;
    constructor(language) {
        super(language.name, () => {
            LocalizationHelper.storeUserLocale(language.locale);
            window.location.reload();
        });
        this.language = language;
    }
    build() {
        const button = super.build();
        button.lang = this.language.locale;
        return button;
    }
}
class SubmenuMenuEntry {
    label;
    entries;
    settings;
    constructor(label, entries, settings) {
        this.label = label;
        this.entries = entries;
        this.settings = settings;
    }
    build() {
        const menu = document.createElement('menu'), alwaysVisible = this.settings?.alwaysVisible ?? false, align = this.settings?.align ?? 'left';
        let result = [menu];
        if (!alwaysVisible) {
            const button = document.createElement('button');
            menu.popover = 'auto';
            button.innerText = this.label;
            button.popoverTargetElement = menu;
            button.popoverTargetAction = 'toggle';
            menu.addEventListener('toggle', (e) => {
                if (!(e instanceof ToggleEvent && e.newState == 'open')) {
                    return;
                }
                const parentBox = menu.parentElement?.getBoundingClientRect();
                menu.style.top = parentBox?.bottom + 'px';
                switch (align) {
                    case 'left':
                        menu.style.left = parentBox?.left + 'px';
                        break;
                    case 'right':
                        const parentRight = parentBox?.right ?? 0, menuRight = window.innerWidth - parentRight;
                        menu.style.right = menuRight + 'px';
                        break;
                }
            });
            result = [button, ...result];
        }
        for (let entry of this.entries) {
            const item = document.createElement('li'), builtEntry = entry.build();
            if (Array.isArray(builtEntry)) {
                for (let element of builtEntry) {
                    item.append(element);
                }
            }
            else {
                item.append(builtEntry);
            }
            menu.append(item);
        }
        return result;
    }
}
class LanguageMenu extends SubmenuMenuEntry {
    constructor(localizer) {
        const entries = [];
        for (let language of LocalizationHelper.languages) {
            entries.push(new LanguageMenuEntry(language));
        }
        super(localizer['menu_label_language'], entries, { align: 'right' });
    }
}
class Menu {
    mainEntry;
    constructor(mainEntry) {
        this.mainEntry = mainEntry;
    }
    build() {
        const container = document.createElement('div'), elements = this.mainEntry.build();
        container.id = 'menu';
        for (let element of elements) {
            container.append(element);
        }
        document.body.append(container);
    }
}
class Eraser extends CellTool {
    renderer;
    id = 'eraser';
    labelResourceId;
    constructor(mapAccessor, renderer) {
        super(mapAccessor);
        this.renderer = renderer;
        this.labelResourceId = 'tool_label_eraser';
    }
    useOnCell(cell) {
        this.mapAccessor.setObjects(cell, []);
        this.renderer.render(cell, 'terrain');
    }
}
class Toolbar {
    tools;
    localizer;
    _activeTool;
    constructor(tools, localizer) {
        this.tools = tools;
        this.localizer = localizer;
    }
    get activeTool() {
        return this._activeTool;
    }
    build() {
        const container = document.createElement('div');
        container.id = 'toolbar';
        for (let tool of this.tools) {
            const id = 'tool-' + tool.id, radio = document.createElement('input'), label = document.createElement('label');
            radio.type = 'radio';
            radio.name = 'active-tool';
            radio.value = id;
            radio.id = id;
            label.htmlFor = id;
            label.innerText = tool.id[0].toLocaleUpperCase();
            label.title = this.localizer[tool.labelResourceId];
            radio.addEventListener('change', () => this._activeTool = tool);
            container.append(radio);
            container.append(label);
        }
        document.body.append(container);
        this._activeTool = this.tools[0];
        this.selectTool(this.tools[0].id);
    }
    selectTool(id) {
        document.getElementById(id)?.click();
    }
}
class ToolActivator {
    toolbar;
    constructor(toolbar) {
        this.toolbar = toolbar;
    }
    start(position) {
        this.toolbar.activeTool?.start(position);
    }
    move(position) {
        this.toolbar.activeTool?.move(position);
    }
    stop(position) {
        this.toolbar.activeTool?.stop(position);
    }
}
class Application {
    ui;
    mapFactory;
    mapLoader;
    constructor(ui, mapFactory, mapLoader) {
        this.ui = ui;
        this.mapFactory = mapFactory;
        this.mapLoader = mapLoader;
    }
    static async build() {
        const locale = LocalizationHelper.getUserLocale();
        document.documentElement.lang = locale;
        const resource = await LocalizationHelper.loadResource(locale);
        const localizer = new Localizer(resource);
        const mapFactory = new MapFactory();
        const mapAccessor = new MapAccessor();
        const canvasProvider = new CanvasProvider();
        const grid = new GridLayer(mapAccessor, canvasProvider);
        const drawerFactory = new CellDrawerFactory(mapAccessor, canvasProvider);
        const mountainFactory = new MountainFactory();
        const mountainsRenderer = new MountainsRenderer();
        const placeRenderer = new PlaceRenderer();
        const riverRenderer = new RiverRenderer();
        const roadRenderer = new RoadRenderer();
        const textRenderer = new TextRenderer();
        const treeRenderer = new TreeRenderer();
        const renderingStrategies = [
            mountainsRenderer,
            placeRenderer,
            riverRenderer,
            roadRenderer,
            textRenderer,
            treeRenderer
        ];
        const cellRenderer = new CellRenderer(drawerFactory, renderingStrategies);
        const eraser = new Eraser(mapAccessor, cellRenderer);
        const modalLauncher = new ModalLauncher(localizer);
        const terrainLayer = new TerrainLayer(mapAccessor, canvasProvider, cellRenderer);
        const textLayer = new TextLayer(mapAccessor, canvasProvider, cellRenderer);
        const uiLayer = new UILayer(mapAccessor, canvasProvider);
        const layers = [
            terrainLayer,
            textLayer,
            grid,
            uiLayer
        ];
        const mapRenderer = new MapRenderer(mapAccessor, layers);
        const mountainsTool = new MountainsTool(mapAccessor, mountainFactory, cellRenderer);
        const placesTool = new PlacesTool(mapAccessor, cellRenderer);
        const riversTool = new RiversTool(mapAccessor, cellRenderer);
        const roadsTool = new RoadsTool(uiLayer, mapAccessor, cellRenderer);
        const textTool = new TextTool(mapAccessor, cellRenderer, modalLauncher, localizer);
        const treesTool = new TreesTool(mapAccessor, cellRenderer);
        const toolbar = new Toolbar([
            mountainsTool,
            placesTool,
            riversTool,
            roadsTool,
            textTool,
            treesTool,
            eraser
        ], localizer);
        const toolActivator = new ToolActivator(toolbar);
        const drawingArea = new DrawingArea(layers, toolActivator);
        const mapLoader = new MapLoader(mapAccessor, drawingArea);
        const newCommand = new New(mapFactory, mapLoader, modalLauncher, localizer);
        const newCommandMenuEntry = new CommandMenuEntry(newCommand);
        const openCommand = new Open(mapLoader, localizer);
        const openCommandMenuEntry = new CommandMenuEntry(openCommand);
        const saveCommand = new Save(mapAccessor, localizer);
        const saveCommandMenuEntry = new CommandMenuEntry(saveCommand);
        const exportCommand = new Export(mapRenderer, localizer);
        const exportCommandMenuEntry = new CommandMenuEntry(exportCommand);
        const fileMenu = new SubmenuMenuEntry('File', [
            newCommandMenuEntry,
            openCommandMenuEntry,
            saveCommandMenuEntry,
            exportCommandMenuEntry
        ]);
        const languageMenu = new LanguageMenu(localizer);
        const mainMenu = new SubmenuMenuEntry('Menu', [
            fileMenu,
            languageMenu
        ], { alwaysVisible: true });
        const menu = new Menu(mainMenu);
        const ui = new ApplicationUI([
            menu,
            toolbar,
            drawingArea
        ]);
        return new Application(ui, mapFactory, mapLoader);
    }
    run() {
        const data = localStorage.getItem('map');
        let map;
        if (data === null) {
            map = this.mapFactory.create(20, 20);
        }
        else {
            map = Utilities.parseMap(data);
        }
        this.ui.build();
        this.mapLoader.load(map);
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const app = await Application.build();
    app.run();
});
class MapFactory {
    create(width, height) {
        return {
            columns: width,
            rows: height,
            pixelsPerCell: 100,
            zoom: 2,
            objects: {}
        };
    }
}
class MapLoader {
    mapAccessor;
    drawingArea;
    constructor(mapAccessor, drawingArea) {
        this.mapAccessor = mapAccessor;
        this.drawingArea = drawingArea;
    }
    load(map) {
        this.mapAccessor.map = map;
        this.drawingArea.setup(map);
    }
}
class Utilities {
    static download(filename, content) {
        const element = document.createElement('a');
        element.href = content;
        element.download = filename;
        element.click();
    }
    static generateId(slug) {
        const connector = '_', date = Date.now().toString(36), random = Math.random().toString(36).substring(2);
        return [slug, date, random].join(connector);
    }
    static hasFlag(value, flag) {
        return (value & flag) === flag;
    }
    static loadFile(callback) {
        const input = document.createElement("input");
        input.type = 'file';
        input.style.display = 'none';
        input.onchange = (e) => this.readFile(e, (f) => {
            callback(f);
            input.remove();
        });
        input.oncancel = () => input.remove();
        document.body.appendChild(input);
        input.click();
    }
    static parseMap(input) {
        const data = JSON.parse(input);
        return data;
    }
    static readFile(e, callback) {
        const input = e.target;
        if (!(input instanceof HTMLInputElement) || input.files === null) {
            throw new Error('Event must be triggered from file input.');
        }
        const file = input.files[0], reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target?.result;
            if (typeof contents === 'string') {
                callback(contents);
            }
            else {
                throw new Error('File must be text');
            }
        };
        reader.readAsText(file);
    }
}
class VectorCalculator {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return VectorMath.add(this, v);
    }
    angle(v) {
        return VectorMath.angle(this, v);
    }
    clamp(min, max) {
        return VectorMath.clamp(this, min, max);
    }
    direction(v) {
        return VectorMath.direction(this, v);
    }
    divide(n) {
        return VectorMath.divide(this, n);
    }
    dotProduct(v) {
        return VectorMath.dotProduct(this, v);
    }
    invert() {
        return VectorMath.invert(this);
    }
    isEqual(v) {
        return VectorMath.isEqual(this, v);
    }
    magnitude() {
        return VectorMath.magnitude(this);
    }
    multiply(n) {
        return VectorMath.multiply(this, n);
    }
    normalize() {
        return VectorMath.normalize(this);
    }
    rotate(rad) {
        return VectorMath.rotate(this, rad);
    }
    round(places) {
        return VectorMath.round(this, places);
    }
    subtract(v) {
        return VectorMath.subtract(this, v);
    }
}
