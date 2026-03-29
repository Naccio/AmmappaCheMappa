"use strict";
class Localizer {
    constructor(resource) {
        Object.assign(this, resource);
    }
}
class UIFactory {
    createCloseButton(onClick) {
        const close = document.createElement('button');
        close.type = 'button';
        close.innerText = 'x';
        close.tabIndex = -1;
        close.onclick = (e) => onClick(e);
        return close;
    }
}
class ModalLauncher {
    uiFactory;
    localizer;
    confirmValue = 'confirm';
    constructor(uiFactory, localizer) {
        this.uiFactory = uiFactory;
        this.localizer = localizer;
    }
    launch(title, content) {
        const dialog = document.createElement('dialog'), header = document.createElement('header'), body = document.createElement('div'), footer = document.createElement('footer'), h1 = document.createElement('h1'), close = this.uiFactory.createCloseButton(e => {
            e.preventDefault();
            dialog.close();
        });
        h1.innerText = title;
        header.append(h1);
        header.append(close);
        body.className = 'dialog-body';
        for (let element of content) {
            body.append(element);
        }
        dialog.append(header);
        dialog.append(body);
        dialog.append(footer);
        dialog.onclose = () => dialog.remove();
        document.body.append(dialog);
        dialog.showModal();
    }
    launchConfirm(title, message, confirmCallback) {
        const p = document.createElement('p');
        p.innerText = message;
        this.launchForm(title, [p], confirmCallback);
    }
    launchForm(title, content, confirmCallback, cancelCallback) {
        const dialog = document.createElement('dialog'), header = document.createElement('header'), body = document.createElement('div'), footer = document.createElement('footer'), form = document.createElement('form'), h1 = document.createElement('h1'), close = this.uiFactory.createCloseButton(e => {
            e.preventDefault();
            dialog.close();
        }), cancel = document.createElement('button'), confirm = document.createElement('button');
        form.method = 'dialog';
        h1.innerText = title;
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
class SimpleCommand {
    _label;
    constructor(label) {
        this._label = label;
    }
    get disabled() {
        return false;
    }
    get label() {
        return this._label;
    }
    onChange() { }
    ;
}
class About extends SimpleCommand {
    modal;
    localizer;
    constructor(modal, localizer) {
        super(localizer['command_label_about']);
        this.modal = modal;
        this.localizer = localizer;
    }
    execute() {
        const quote = document.createElement('blockquote'), version = document.createElement('div'), versionLink = document.createElement('a');
        quote.innerText = this.localizer['paragraph_about'];
        versionLink.innerText = 'alpha.2';
        versionLink.href = 'https://github.com/Naccio/AmmappaCheMappa';
        versionLink.target = '_blank';
        version.innerText = 'v ';
        version.append(versionLink);
        this.modal.launch('Ammappa che mappa!', [quote, version]);
    }
}
class InternalEvent {
    handlers = [];
    subscribe(handler) {
        this.handlers.push(handler);
    }
    unsubscribe(handler) {
        this.handlers = this.handlers.filter(item => item !== handler);
    }
    trigger(data) {
        for (const handler of this.handlers) {
            handler(data);
        }
    }
}
class EventManager {
    subscriptions = {};
    subscribe(type, handler) {
        this.getEvent(type).subscribe(handler);
    }
    unsubscribe(type, handler) {
        this.getEvent(type).unsubscribe(handler);
    }
    trigger(type, data) {
        this.getEvent(type).trigger(data);
    }
    getEvent(type) {
        let event = this.subscriptions[type];
        if (event === undefined) {
            event = new InternalEvent();
            this.subscriptions[type] = event;
        }
        return event;
    }
}
class LayerAccessor {
    data;
    drawing;
    renderer;
    constructor(data, drawing, renderer) {
        this.data = data;
        this.drawing = drawing;
        this.renderer = renderer;
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
class LayersHelper {
    static create(type, name) {
        return {
            id: Utilities.generateId('layer'),
            name,
            type
        };
    }
}
class LayerFactory {
    factories;
    constructor(factories) {
        this.factories = factories;
    }
    create(layer) {
        const factory = this.getFactory(layer.type);
        return {
            data: layer,
            renderer: factory.createRenderer(layer.id),
            drawing: factory.createDrawing(layer.id)
        };
    }
    getFactory(type) {
        const factory = this.factories.find(f => f.type === type);
        if (factory === undefined) {
            throw new Error('Could not find layer factory for type ' + type);
        }
        return factory;
    }
}
class LayersManager {
    factory;
    mapAccessor;
    createEvent = new InternalEvent();
    deleteEvent = new InternalEvent();
    selectEvent = new InternalEvent();
    updateEvent = new InternalEvent();
    _activeLayer;
    layers = [];
    constructor(factory, mapAccessor) {
        this.factory = factory;
        this.mapAccessor = mapAccessor;
    }
    get activeLayer() {
        return this._activeLayer;
    }
    get mapId() {
        return this.mapAccessor.id;
    }
    add(layer) {
        const accessor = this.factory.create(layer);
        this.layers.push(accessor);
        this.createEvent.trigger(accessor);
        return accessor;
    }
    delete(id) {
        const layer = this.getLayer(id);
        this.layers = this.layers.filter(l => l.data.id !== id);
        if (this.activeLayer?.data.id === id) {
            this._activeLayer = undefined;
        }
        this.deleteEvent.trigger(layer.data);
    }
    select(id) {
        const layer = this.getLayer(id);
        this._activeLayer = layer;
        this.mapAccessor.map.activeLayer = id;
        this.mapAccessor.save();
        this.selectEvent.trigger(layer);
    }
    setObjects(index, objects) {
        if (this._activeLayer === undefined) {
            return;
        }
        objects.forEach(o => o.layer = this._activeLayer.data.id);
        this.mapAccessor.setObjects(index, objects);
        this.updateEvent.trigger(index);
    }
    update(id, action) {
        const layer = this.getLayer(id);
        action(layer.data);
        this.mapAccessor.save();
        this.updateEvent.trigger(layer.data);
    }
    onUpdate(handler) {
        this.updateEvent.subscribe(handler);
    }
    onSelect(handler) {
        this.selectEvent.subscribe(handler);
    }
    onCreate(handler) {
        this.createEvent.subscribe(handler);
    }
    onDelete(handler) {
        this.deleteEvent.subscribe(handler);
    }
    getLayer(id) {
        const layer = this.layers.find(l => l.data.id === id);
        if (layer === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }
        return layer;
    }
}
class Store {
    _state;
    get state() {
        if (!this._state) {
            this._state = this.loadState();
        }
        return this._state;
    }
    get activeMap() {
        return this.state.activeMap;
    }
    set activeMap(id) {
        this.state.activeMap = id;
        this.storeState();
    }
    get locale() {
        return this.state.locale;
    }
    set locale(language) {
        this.state.locale = language;
        this.storeState();
    }
    get maps() {
        return this.state.maps;
    }
    deleteMap(id) {
        const map = this.state.maps.find(m => m.data.id === id);
        if (map) {
            this.state.maps.splice(this.state.maps.indexOf(map), 1);
        }
        this.storeState();
    }
    saveMap(map) {
        if (this.state.maps.indexOf(map) === -1) {
            this.state.maps.push(map);
        }
        this.storeState();
    }
    loadState() {
        const storedState = localStorage.getItem('state');
        return storedState
            ? JSON.parse(storedState)
            : { maps: [] };
    }
    storeState() {
        localStorage.setItem('state', JSON.stringify(this.state));
    }
}
class MapAccessor {
    _map;
    store;
    constructor(_map, store) {
        this._map = _map;
        this.store = store;
    }
    get id() {
        return this.map.data.id;
    }
    get map() {
        return this._map;
    }
    get scale() {
        return this.map.zoom / this.map.data.pixelsPerCell;
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
        const name = GridHelper.cellIndexToName(index), objects = this.map.data.objects[name] ?? [];
        return {
            index,
            objects
        };
    }
    getIndex(position) {
        if (position === undefined) {
            return undefined;
        }
        const map = this.map.data, cell = VectorMath.multiply(position, this.scale), column = Math.floor(cell.x), row = Math.floor(cell.y);
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
        return VectorMath.multiply(shift, this.map.data.pixelsPerCell);
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
    save() {
        if (this._map) {
            this.store.saveMap(this._map);
        }
    }
    setObjects(index, objects) {
        const cellName = GridHelper.cellIndexToName(index);
        if (objects.length === 0) {
            delete this.map.data.objects[cellName];
        }
        else {
            this.map.data.objects[cellName] = objects;
        }
        this.save();
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
class MapManager {
    mapAccessor;
    layers;
    constructor(mapAccessor, layers) {
        this.mapAccessor = mapAccessor;
        this.layers = layers;
    }
    get id() {
        return this.mapAccessor.id;
    }
}
class MapsManager {
    store;
    factory;
    modal;
    localizer;
    addEvent = new InternalEvent();
    removeEvent = new InternalEvent();
    activateEvent = new InternalEvent();
    maps = {};
    _activeMap;
    constructor(store, factory, modal, localizer) {
        this.store = store;
        this.factory = factory;
        this.modal = modal;
        this.localizer = localizer;
    }
    get activeMap() {
        return this._activeMap;
    }
    add(map) {
        const manager = this.factory.create(map), id = map.data.id;
        this.maps[id] = manager;
        this.addEvent.trigger(manager);
        this.activate(id);
    }
    remove(id) {
        this.modal.launchConfirm(this.localizer['confirm_close_map_title'], this.localizer['confirm_close_map_message'], () => {
            delete this.maps[id];
            this.store.deleteMap(id);
            this.removeEvent.trigger(id);
            for (let key in this.maps) {
                this.activate(key);
                break;
            }
            if (this._activeMap?.id === id) {
                this._activeMap = undefined;
                this.store.activeMap = undefined;
                this.activateEvent.trigger(undefined);
            }
        });
    }
    activate(id) {
        const map = this.maps[id];
        this._activeMap = map;
        this.store.activeMap = id;
        this.activateEvent.trigger(map);
    }
    onActivate(handler) {
        this.activateEvent.subscribe(handler);
    }
    onAdd(handler) {
        this.addEvent.subscribe(handler);
    }
    onRemove(handler) {
        this.removeEvent.subscribe(handler);
    }
    setup() {
        const maps = this.store.maps, activeMap = maps.find(m => m.data.id == this.store.activeMap);
        this.maps = {};
        maps.forEach(m => this.add(m));
        if (activeMap) {
            this.activate(activeMap.data.id);
        }
    }
}
class ActiveMapCommand {
    changeEvent = new InternalEvent();
    _label;
    _disabled = true;
    constructor(mapsManager, label) {
        this._label = label;
        mapsManager.onActivate(map => this.activeMapHandler(map));
    }
    get disabled() {
        return this._disabled;
    }
    get label() {
        return this._label;
    }
    onChange(handler) {
        this.changeEvent.subscribe(handler);
    }
    ;
    activeMapHandler(map) {
        const disabled = map === undefined;
        this._disabled = disabled;
        this.changeEvent.trigger(disabled);
    }
}
class Close extends ActiveMapCommand {
    maps;
    constructor(maps, localizer) {
        super(maps, localizer['command_label_close']);
        this.maps = maps;
    }
    execute() {
        const map = this.maps.activeMap;
        if (map === undefined) {
            return;
        }
        this.maps.remove(map.id);
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
class MapRenderer {
    render(mapManager) {
        const map = mapManager.mapAccessor.map.data, canvas = document.createElement('canvas'), layers = mapManager.layers.layers.filter(l => !l.data.hidden);
        canvas.width = map.columns * map.pixelsPerCell;
        canvas.height = map.rows * map.pixelsPerCell;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const drawer = new CanvasDrawer(canvas);
        for (let layer of layers) {
            layer.renderer.render(drawer);
        }
        return canvas;
    }
}
class Export extends ActiveMapCommand {
    renderer;
    maps;
    constructor(renderer, maps, localizer) {
        super(maps, localizer['command_label_export']);
        this.renderer = renderer;
        this.maps = maps;
    }
    execute() {
        const map = this.maps.activeMap;
        if (map) {
            const renderedMap = this.renderer.render(map);
            Utilities.download('map.png', renderedMap.toDataURL());
        }
    }
}
class Open extends SimpleCommand {
    mapsManager;
    constructor(mapsManager, localizer) {
        super(localizer['command_label_open']);
        this.mapsManager = mapsManager;
    }
    execute() {
        Utilities.loadFile((f) => this.readFile(f));
    }
    readFile(file) {
        const map = Utilities.parseMap(file);
        this.mapsManager.add(map);
    }
}
class New extends SimpleCommand {
    mapFactory;
    mapsManager;
    modal;
    localizer;
    constructor(mapFactory, mapsManager, modal, localizer) {
        super(localizer['command_label_new']);
        this.mapFactory = mapFactory;
        this.mapsManager = mapsManager;
        this.modal = modal;
        this.localizer = localizer;
    }
    execute() {
        const titleWrapper = document.createElement('div'), titleInput = document.createElement('input'), titleLabel = document.createElement('label'), columnsInput = document.createElement('input'), columnsLabel = document.createElement('label'), rowsInput = document.createElement('input'), rowsLabel = document.createElement('label'), title = this.localizer['form_title_new_map'];
        titleInput.id = 'title';
        titleInput.type = 'text';
        titleLabel.htmlFor = titleInput.id;
        titleLabel.innerText = this.localizer['input_label_title'];
        titleWrapper.append(titleLabel, titleInput);
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
        this.modal.launchForm(title, [titleWrapper, columnsLabel, columnsInput, rowsLabel, rowsInput], () => {
            const title = titleInput.value === '' ? undefined : titleInput.value, columns = parseInt(columnsInput.value), rows = parseInt(rowsInput.value), map = this.mapFactory.create(title, columns, rows);
            this.mapsManager.add(map);
        });
    }
}
class Save extends ActiveMapCommand {
    maps;
    constructor(maps, localizer) {
        super(maps, localizer['command_label_save']);
        this.maps = maps;
    }
    execute() {
        const map = this.maps.activeMap?.mapAccessor.map;
        if (map === undefined) {
            return;
        }
        const json = JSON.stringify(map), content = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json);
        Utilities.download('map.json', content);
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
    get pixelsPerCell() {
        return this.mapAccessor.map.data.pixelsPerCell;
    }
    get cell() {
        return this.mapAccessor.getCell(this.cellIndex);
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
        const pixels = this.pixelsPerCell, cellShift = this.mapAccessor.getPosition(this.cellIndex);
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
class PlacesHelper {
    static layer = 'terrain';
    static objectType = 'place';
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
class TextRenderer extends GenericObjectRenderer {
    lineWidth = 2;
    is(object) {
        return object.type === TextHelper.objectType;
    }
    draw(text, drawer) {
        drawer.text(text.position, text.value, text.fontSize);
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
class LocalizationHelper {
    static languages = [{
            locale: "en",
            name: "English"
        }, {
            locale: "it",
            name: "Italiano"
        }];
}
class LocalizerFactory {
    state;
    constructor(state) {
        this.state = state;
    }
    async create() {
        const locale = this.getUserLocale();
        document.documentElement.lang = locale;
        const resource = await this.loadResource(locale);
        return new Localizer(resource);
    }
    getUserLocale() {
        let locale = this.state.locale;
        if (locale === undefined) {
            locale = new Intl.Locale(navigator.language).language;
        }
        if (!this.isValid(locale)) {
            locale = LocalizationHelper.languages[0].locale;
        }
        if (this.state.locale !== locale) {
            this.state.locale = locale;
        }
        return locale;
    }
    isValid(locale) {
        return LocalizationHelper.languages.find(l => l.locale === locale) !== undefined;
    }
    async loadResource(locale) {
        const response = await fetch(`resources/${locale}.json`);
        const json = await response.json();
        return json;
    }
}
class ApplicationUI {
    elements;
    constructor(elements) {
        this.elements = elements;
    }
    build() {
        for (let element of this.elements) {
            document.body.appendChild(element.html);
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
        drawer.scale(scale);
        return drawer;
    }
}
class LayersPanel {
    layers;
    localizer;
    container;
    constructor(layers, localizer) {
        this.layers = layers;
        this.localizer = localizer;
        const container = document.createElement('div');
        container.className = 'layers';
        this.layers.onCreate(l => this.buildLayer(l));
        this.layers.onDelete(l => this.removeLayer(l.id));
        this.layers.onSelect(l => this.selectLayer(l));
        this.container = container;
    }
    get html() {
        return this.container;
    }
    buildLayer(layer) {
        const data = layer.data, id = data.id, mapId = this.layers.mapId, type = this.localizer[`layer_type_${data.type}`], wrapper = document.createElement('div'), check = document.createElement('input'), radio = document.createElement('input'), label = document.createElement('label'), typeLabel = document.createElement('small');
        check.type = 'checkbox';
        check.name = mapId + '-visible-layers';
        check.value = id;
        check.id = id + '-visible';
        check.checked = !data.hidden;
        check.onchange = () => this.layers.update(id, l => l.hidden = !check.checked);
        radio.type = 'radio';
        radio.name = mapId + '-active-layer';
        radio.value = id;
        radio.id = this.getRadioId(id);
        radio.className = 'label-radio';
        radio.onchange = () => this.layers.select(id);
        typeLabel.innerText = `(${type})`;
        label.htmlFor = radio.id;
        label.innerText = data.name;
        label.title = data.name;
        label.append(typeLabel);
        wrapper.id = this.getWrapperId(id);
        wrapper.append(check);
        wrapper.append(radio);
        wrapper.append(label);
        this.container.append(wrapper);
    }
    getRadioId(id) {
        return id + '-active';
    }
    getWrapperId(id) {
        return id + '-panel-controls';
    }
    removeLayer(id) {
        id = this.getWrapperId(id);
        document.getElementById(id)?.remove();
    }
    selectLayer(layer) {
        const id = this.getRadioId(layer.data.id);
        document.getElementById(id)?.click();
    }
}
class DrawingUI {
    mapAccessor;
    canvasProvider;
    _drawer;
    constructor(mapAccessor, canvasProvider) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
        const map = this.mapAccessor.map, mapData = map.data, id = mapData.id + '-ui-layer', drawer = this.canvasProvider.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell, 1 / map.zoom);
        this._drawer = drawer;
    }
    get drawer() {
        return this._drawer;
    }
    get html() {
        return this._drawer.canvas;
    }
    update() {
    }
    zoom() {
        this._drawer.scale(1 / this.mapAccessor.map.zoom);
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
class MapDrawer {
    mapManager;
    store;
    ui;
    actualShift = VectorMath.zero;
    container;
    constructor(mapManager, store, ui) {
        this.mapManager = mapManager;
        this.store = store;
        this.ui = ui;
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.append(ui.html);
        this.container = container;
        mapManager.layers.onCreate(this.layerCreateHandler);
        mapManager.layers.onUpdate(this.layerUpdateHandler);
    }
    get html() {
        return this.container;
    }
    get layers() {
        const mapLayers = this.mapManager.layers.layers.map(l => l.drawing);
        return [...mapLayers, this.ui];
    }
    get currentShift() {
        return this.map.position;
    }
    get map() {
        return this.mapManager.mapAccessor.map;
    }
    center() {
        this.shift(VectorMath.multiply(this.currentShift, -1));
    }
    getMapPoint(viewportPoint) {
        return VectorMath.subtract(viewportPoint, this.actualShift);
    }
    resize(direction) {
        const map = this.map, min = 1, max = 5, currentZoom = map.zoom, newZoom = MathHelper.clamp(currentZoom + direction, min, max);
        map.zoom = newZoom;
        this.computeSize();
        this.shift(VectorMath.zero);
        this.store.saveMap(map);
        this.layers.forEach(l => l.zoom());
    }
    shift(vector) {
        this.map.position = VectorMath.add(this.currentShift, vector);
        this.actualShift = this.computeActualShift();
        this.container.style.left = this.actualShift.x + 'px';
        this.container.style.top = this.actualShift.y + 'px';
        this.store.saveMap(this.map);
    }
    computeActualShift() {
        const container = this.container, parent = container.parentElement;
        if (!parent) {
            throw new Error('Map drawer not set up correctly.');
        }
        const shiftToCenter = {
            x: (parent.clientWidth - container.clientWidth) / 2,
            y: (parent.clientHeight - container.clientHeight) / 2
        };
        return VectorMath.add(this.currentShift, shiftToCenter);
    }
    computeSize() {
        const map = this.map, mapData = map.data, multiplier = mapData.pixelsPerCell / map.zoom;
        this.container.style.width = mapData.columns * multiplier + 'px';
        this.container.style.height = mapData.rows * multiplier + 'px';
    }
    layerCreateHandler = (c) => {
        this.container.append(c.drawing.html);
        c.renderer.render();
        this.layerDataUpdateHandler(c.data);
    };
    layerDataUpdateHandler = (c) => {
        const element = document.getElementById(c.id);
        if (element) {
            element.style.display = c.hidden ? 'none' : 'block';
        }
    };
    layerUpdateHandler = (c) => {
        if ('id' in c) {
            this.layerDataUpdateHandler(c);
        }
        else {
            this.mapManager.layers.activeLayer?.drawing.update(c);
        }
    };
}
class DrawingArea {
    tool;
    drawer;
    doubleClickThreshold = 250;
    wrapper;
    isShifting = false;
    isDrawing = false;
    lastShift = VectorMath.zero;
    lastWheelClick = 0;
    constructor(tool, drawer) {
        this.tool = tool;
        this.drawer = drawer;
        const wrapper = document.createElement('div');
        wrapper.className = 'drawing-area';
        wrapper.append(drawer.html);
        wrapper.addEventListener('mousedown', this.mouseDownHandler);
        wrapper.addEventListener('mouseleave', this.mouseLeaveHandler);
        wrapper.addEventListener('mousemove', this.mouseMoveHandler);
        wrapper.addEventListener('wheel', this.wheelHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        window.addEventListener('blur', this.blurHandler);
        window.addEventListener('resize', this.resizeHandler);
        this.wrapper = wrapper;
    }
    get html() {
        return this.wrapper;
    }
    setup() {
        this.drawer.resize(0);
    }
    getMapPoint(viewPortPoint) {
        const boundingRectangle = this.wrapper.getBoundingClientRect(), point = VectorMath.subtract(viewPortPoint, boundingRectangle);
        return this.drawer.getMapPoint(point);
    }
    startDraw(coordinates) {
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
    resizeHandler = () => {
        this.setup();
    };
    wheelHandler = (e) => {
        const direction = Math.sign(e.deltaY);
        this.zoom(direction);
    };
}
class Toolbar {
    tools;
    mapAccessor;
    layers;
    container;
    _activeTool;
    constructor(tools, localizer, mapAccessor, layers) {
        this.tools = tools;
        this.mapAccessor = mapAccessor;
        this.layers = layers;
        const container = document.createElement('div');
        container.className = 'toolbar';
        for (let tool of tools) {
            const configuration = tool.configuration, id = configuration.id, radioId = this.getRadioId(id), radio = document.createElement('input'), label = document.createElement('label');
            radio.type = 'radio';
            radio.name = mapAccessor.id + '-active-tool';
            radio.value = id;
            radio.id = radioId;
            radio.className = 'label-radio';
            label.htmlFor = radioId;
            label.innerText = id[0].toLocaleUpperCase();
            label.title = localizer[configuration.labelResourceId];
            radio.addEventListener('change', () => this._activeTool = tool);
            container.append(radio);
            container.append(label);
        }
        this.container = container;
        layers.onSelect(this.layerSelectHandle);
    }
    get activeTool() {
        return this._activeTool;
    }
    get html() {
        return this.container;
    }
    getRadio(id) {
        id = this.getRadioId(id);
        return document.getElementById(id);
    }
    getRadioId(id) {
        return `${this.mapAccessor.id}-${id}-tool`;
    }
    selectFirstTool() {
        for (let tool of this.tools) {
            if (this.isCompatibleWith(tool, this.layers.activeLayer)) {
                this.selectTool(tool.configuration.id);
                this._activeTool = tool;
                return;
            }
        }
        this._activeTool = undefined;
    }
    selectTool(id) {
        id = this.getRadioId(id);
        document.getElementById(id)?.click();
    }
    isCompatibleWith(tool, layer) {
        if (!tool || !layer) {
            return false;
        }
        const layerTypes = tool.configuration.layerTypes;
        return layerTypes.length === 0 || layerTypes.includes(layer.data.type);
    }
    layerSelectHandle = (layer) => {
        for (let tool of this.tools) {
            const radio = this.getRadio(tool.configuration.id);
            radio.disabled = !this.isCompatibleWith(tool, layer);
        }
        if (!this.isCompatibleWith(this.activeTool, layer)) {
            this.selectFirstTool();
        }
    };
}
class MapUI {
    map;
    toolbar;
    drawingArea;
    layersPanel;
    container;
    constructor(map, toolbar, drawingArea, layersPanel) {
        this.map = map;
        this.toolbar = toolbar;
        this.drawingArea = drawingArea;
        this.layersPanel = layersPanel;
        const container = document.createElement('div');
        container.id = this.id;
        container.className = 'map-ui';
        container.append(this.toolbar.html);
        container.append(this.drawingArea.html);
        container.append(this.layersPanel.html);
        this.container = container;
    }
    get id() {
        return this.map.id + '-ui';
    }
    get html() {
        return this.container;
    }
    hide() {
        this.container.style.display = 'none';
    }
    remove() {
        this.container.remove();
    }
    setup() {
        const mapAccessor = this.map.mapAccessor, layersManager = this.map.layers, map = mapAccessor.map;
        mapAccessor.map.data.layers.forEach(l => layersManager.add(l));
        layersManager.select(map.activeLayer);
    }
    show() {
        this.container.style.display = 'grid';
        this.drawingArea.setup();
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
class Eraser extends CellTool {
    layers;
    configuration = {
        id: 'eraser',
        labelResourceId: 'tool_label_eraser',
        layerTypes: ['terrain', 'text']
    };
    constructor(mapAccessor, layers) {
        super(mapAccessor);
        this.layers = layers;
    }
    useOnCell(cell) {
        this.layers.setObjects(cell, []);
    }
}
class ToolsManager {
    _tools;
    constructor(_tools) {
        this._tools = _tools;
    }
    get tools() {
        return [...this._tools];
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
    static isMountain(object) {
        return object.type === this.objectType;
    }
}
class MountainsTool extends CellTool {
    mountainFactory;
    layers;
    configuration = {
        id: 'mountains',
        labelResourceId: 'tool_label_mountains',
        layerTypes: ['terrain']
    };
    constructor(mapAccessor, mountainFactory, layers) {
        super(mapAccessor);
        this.mountainFactory = mountainFactory;
        this.layers = layers;
    }
    useOnCell(cell) {
        const mountains = [];
        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const mountain = this.mountainFactory.create(quadrant);
            mountains.push(mountain);
        }
        this.layers.setObjects(cell, mountains);
    }
}
class PlacesTool {
    mapAccessor;
    layers;
    configuration = {
        id: 'places',
        labelResourceId: 'tool_label_places',
        layerTypes: ['terrain']
    };
    constructor(mapAccessor, layers) {
        this.mapAccessor = mapAccessor;
        this.layers = layers;
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
        this.layers.setObjects(cell, [place]);
    }
    move() {
    }
    stop() {
    }
}
class RiversTool {
    mapAccessor;
    layers;
    configuration = {
        id: 'rivers',
        labelResourceId: 'tool_label_rivers',
        layerTypes: ['terrain']
    };
    startPosition;
    activeCell;
    constructor(mapAccessor, layers) {
        this.mapAccessor = mapAccessor;
        this.layers = layers;
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
            const map = this.mapAccessor.map, river = this.getRiver(cell), cellPosition = this.mapAccessor.getPosition(cell);
            this.createRivers(activeCell, this.startPosition, cell, position);
            this.startPosition = VectorMath.startOperation(river.from)
                .multiply(map.data.pixelsPerCell)
                .add(cellPosition)
                .divide(map.zoom);
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
                this.layers.setObjects(cell, [river]);
                this.startPosition = this.mapAccessor.absolutePosition(cell, river.from);
            }
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
        this.layers.setObjects(cell, [river]);
        return river;
    }
    getRiver(cell) {
        return this.mapAccessor.getCell(cell).objects[0];
    }
}
class RoadsTool {
    ui;
    mapAccessor;
    layers;
    configuration = {
        id: 'roads',
        labelResourceId: 'tool_label_roads',
        layerTypes: ['terrain']
    };
    startPosition;
    constructor(ui, mapAccessor, layers) {
        this.ui = ui;
        this.mapAccessor = mapAccessor;
        this.layers = layers;
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
        this.createRoads(firstCell, this.startPosition, lastCell, position);
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
        this.layers.setObjects(cell, [road]);
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
    layers;
    modal;
    localizer;
    configuration = {
        id: 'text',
        labelResourceId: 'tool_label_text',
        layerTypes: ['text']
    };
    constructor(mapAccessor, layers, modal, localizer) {
        this.mapAccessor = mapAccessor;
        this.layers = layers;
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
            this.layers.setObjects(cell, [text]);
        });
    }
    move() {
    }
    stop() {
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
    layers;
    configuration = {
        id: 'trees',
        labelResourceId: 'tool_label_trees',
        layerTypes: ['terrain']
    };
    constructor(mapAccessor, layers) {
        super(mapAccessor);
        this.layers = layers;
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
        this.layers.setObjects(cell, trees);
    }
}
class ToolsManagerFactory {
    modalLauncher;
    mountainFactory;
    localizer;
    constructor(modalLauncher, mountainFactory, localizer) {
        this.modalLauncher = modalLauncher;
        this.mountainFactory = mountainFactory;
        this.localizer = localizer;
    }
    create(mapAccessor, layersManager, uiLayer) {
        const eraser = new Eraser(mapAccessor, layersManager);
        const mountainsTool = new MountainsTool(mapAccessor, this.mountainFactory, layersManager);
        const placesTool = new PlacesTool(mapAccessor, layersManager);
        const riversTool = new RiversTool(mapAccessor, layersManager);
        const roadsTool = new RoadsTool(uiLayer, mapAccessor, layersManager);
        const textTool = new TextTool(mapAccessor, layersManager, this.modalLauncher, this.localizer);
        const treesTool = new TreesTool(mapAccessor, layersManager);
        const tools = [
            mountainsTool,
            placesTool,
            riversTool,
            roadsTool,
            textTool,
            treesTool,
            eraser
        ];
        return new ToolsManager(tools);
    }
}
class MapUIFactory {
    canvasProvider;
    toolsFactory;
    localizer;
    store;
    constructor(canvasProvider, toolsFactory, localizer, store) {
        this.canvasProvider = canvasProvider;
        this.toolsFactory = toolsFactory;
        this.localizer = localizer;
        this.store = store;
    }
    create(mapManager) {
        const mapAccessor = mapManager.mapAccessor, layersManager = mapManager.layers;
        const uiLayer = new DrawingUI(mapAccessor, this.canvasProvider);
        const tools = this.toolsFactory.create(mapAccessor, layersManager, uiLayer);
        const toolbar = new Toolbar(tools.tools, this.localizer, mapAccessor, layersManager);
        const toolActivator = new ToolActivator(toolbar);
        const drawer = new MapDrawer(mapManager, this.store, uiLayer);
        const drawingArea = new DrawingArea(toolActivator, drawer);
        const layersPanel = new LayersPanel(layersManager, this.localizer);
        return new MapUI(mapManager, toolbar, drawingArea, layersPanel);
    }
}
class Welcome {
    container;
    constructor(openCommand, newCommand, localizer) {
        const container = document.createElement('div'), message = document.createElement('p'), buttons = document.createElement('div'), openButton = document.createElement('button'), newButton = document.createElement('button');
        container.id = 'welcome';
        message.innerText = localizer['paragraph_about'];
        openButton.innerText = localizer['command_label_open'];
        openButton.onclick = () => openCommand.execute();
        newButton.innerText = localizer['command_label_new'];
        newButton.onclick = () => newCommand.execute();
        buttons.append(openButton, newButton);
        container.append(message, buttons);
        this.container = container;
    }
    get html() {
        return this.container;
    }
}
class MainArea {
    mapsManager;
    mapUIFactory;
    uiFactory;
    welcome;
    container;
    tabs;
    maps = [];
    constructor(mapsManager, mapUIFactory, uiFactory, welcome) {
        this.mapsManager = mapsManager;
        this.mapUIFactory = mapUIFactory;
        this.uiFactory = uiFactory;
        this.welcome = welcome;
        const container = document.createElement('div'), tabs = document.createElement('ul');
        container.id = 'main-area';
        tabs.className = 'tabs';
        container.append(tabs);
        this.container = container;
        this.tabs = tabs;
        this.activate(undefined);
        mapsManager.onActivate(map => this.activate(map));
        mapsManager.onAdd(map => this.add(map));
        mapsManager.onRemove(id => this.remove(id));
    }
    get html() {
        return this.container;
    }
    activate(manager) {
        this.maps.forEach(m => {
            m.ui.hide();
            m.tab.classList.remove('active');
        });
        if (manager) {
            const map = this.getMap(manager.id);
            map.ui.show();
            map.tab.classList.add('active');
        }
        else {
            this.container.append(this.welcome.html);
        }
    }
    getMap(id) {
        const map = this.maps.find(m => m.id === id);
        if (map === undefined) {
            throw Error(`Could not find map with id '${id}'.`);
        }
        return map;
    }
    add(map) {
        const id = map.id, ui = this.mapUIFactory.create(map), tab = document.createElement('li'), anchor = document.createElement('a'), close = this.uiFactory.createCloseButton(e => {
            e.stopPropagation();
            this.mapsManager.remove(id);
        });
        document.getElementById('welcome')?.remove();
        tab.className = 'tab';
        anchor.href = '#' + ui.id;
        anchor.innerText = map.mapAccessor.map.data.title ?? id;
        anchor.onclick = () => this.mapsManager.activate(id);
        tab.append(anchor, close);
        this.maps.push({
            id,
            map,
            ui,
            tab
        });
        this.container.append(ui.html);
        this.tabs.append(tab);
        ui.setup();
    }
    remove(id) {
        const map = this.getMap(id);
        map.tab.remove();
        map.ui.remove();
        this.maps.splice(this.maps.indexOf(map), 1);
    }
}
class ButtonMenuEntry {
    label;
    action;
    button;
    constructor(label, action) {
        this.label = label;
        this.action = action;
        const button = document.createElement('button');
        button.innerText = this.label;
        button.onclick = () => this.action();
        this.button = button;
    }
    build() {
        return this.button;
    }
}
class CommandMenuEntry extends ButtonMenuEntry {
    constructor(command) {
        super(command.label, () => command.execute());
        command.onChange(disabled => {
            this.button.disabled = disabled;
        });
    }
}
class LanguageMenuEntry extends ButtonMenuEntry {
    language;
    constructor(state, language) {
        super(language.name, () => {
            state.locale = language.locale;
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
    constructor(state, localizer) {
        const entries = [];
        for (let language of LocalizationHelper.languages) {
            entries.push(new LanguageMenuEntry(state, language));
        }
        super(localizer['menu_label_language'], entries, { align: 'right' });
    }
}
class Menu {
    mainEntry;
    container;
    constructor(mainEntry) {
        this.mainEntry = mainEntry;
        const container = document.createElement('div'), elements = this.mainEntry.build();
        container.id = 'menu';
        for (let element of elements) {
            container.append(element);
        }
        this.container = container;
    }
    get html() {
        return this.container;
    }
}
class Application {
    mapsManager;
    constructor(mapsManager) {
        this.mapsManager = mapsManager;
    }
    static async build() {
        const store = new Store();
        const localizerFactory = new LocalizerFactory(store);
        const localizer = await localizerFactory.create();
        const mapFactory = new MapFactory(localizer);
        const canvasProvider = new CanvasProvider();
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
        const uiFactory = new UIFactory();
        const modalLauncher = new ModalLauncher(uiFactory, localizer);
        const mapManagerFactory = new MapManagerFactory(store, canvasProvider, renderingStrategies);
        const mapsManager = new MapsManager(store, mapManagerFactory, modalLauncher, localizer);
        const toolsManagerFactory = new ToolsManagerFactory(modalLauncher, mountainFactory, localizer);
        const mapUIFactory = new MapUIFactory(canvasProvider, toolsManagerFactory, localizer, store);
        const mapRenderer = new MapRenderer();
        const newCommand = new New(mapFactory, mapsManager, modalLauncher, localizer);
        const newCommandMenuEntry = new CommandMenuEntry(newCommand);
        const openCommand = new Open(mapsManager, localizer);
        const openCommandMenuEntry = new CommandMenuEntry(openCommand);
        const saveCommand = new Save(mapsManager, localizer);
        const saveCommandMenuEntry = new CommandMenuEntry(saveCommand);
        const exportCommand = new Export(mapRenderer, mapsManager, localizer);
        const exportCommandMenuEntry = new CommandMenuEntry(exportCommand);
        const closeCommand = new Close(mapsManager, localizer);
        const closeCommandMenuEntry = new CommandMenuEntry(closeCommand);
        const fileMenu = new SubmenuMenuEntry('File', [
            newCommandMenuEntry,
            openCommandMenuEntry,
            saveCommandMenuEntry,
            exportCommandMenuEntry,
            closeCommandMenuEntry
        ]);
        const aboutCommand = new About(modalLauncher, localizer);
        const aboutCommandMenuEntry = new CommandMenuEntry(aboutCommand);
        const helpMenu = new SubmenuMenuEntry(localizer['menu_label_help'], [
            aboutCommandMenuEntry
        ]);
        const languageMenu = new LanguageMenu(store, localizer);
        const mainMenu = new SubmenuMenuEntry('Menu', [
            fileMenu,
            helpMenu,
            languageMenu
        ], { alwaysVisible: true });
        const menu = new Menu(mainMenu);
        const welcome = new Welcome(openCommand, newCommand, localizer);
        const mainArea = new MainArea(mapsManager, mapUIFactory, uiFactory, welcome);
        const ui = new ApplicationUI([
            menu,
            mainArea
        ]);
        ui.build();
        return new Application(mapsManager);
    }
    run() {
        this.mapsManager.setup();
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const app = await Application.build();
    app.run();
});
class MapFactory {
    localizer;
    constructor(localizer) {
        this.localizer = localizer;
    }
    create(title, width, height) {
        const layers = [
            LayersHelper.create('text', this.localizer['layer_type_text']),
            LayersHelper.create('grid', this.localizer['layer_type_grid']),
            LayersHelper.create('terrain', this.localizer['layer_type_terrain'])
        ];
        return {
            zoom: 2,
            position: { x: .5, y: .5 },
            activeLayer: layers[0].id,
            data: {
                id: Utilities.generateId('map'),
                title,
                columns: width,
                rows: height,
                pixelsPerCell: 100,
                objects: {},
                layers
            }
        };
    }
}
class CellDrawerFactory {
    mapAccessor;
    constructor(mapAccessor) {
        this.mapAccessor = mapAccessor;
    }
    create(cell, drawer) {
        return new CellDrawer(cell, this.mapAccessor, drawer);
    }
}
class CellRenderer {
    drawerFactory;
    renderers;
    constructor(drawerFactory, renderers) {
        this.drawerFactory = drawerFactory;
        this.renderers = renderers;
    }
    render(cell, drawer, layer) {
        const cellDrawer = this.drawerFactory.create(cell, drawer), objects = cellDrawer.cell.objects.filter(o => o.layer === layer);
        cellDrawer.clear();
        for (let object of objects) {
            this.renderObject(object, cellDrawer);
        }
    }
    renderObject(object, drawer) {
        for (let strategy of this.renderers) {
            strategy.render(object, drawer);
        }
    }
}
class DefaultLayer {
    id;
    mapAccessor;
    drawer;
    renderer;
    constructor(id, mapAccessor, drawer, renderer) {
        this.id = id;
        this.mapAccessor = mapAccessor;
        this.drawer = drawer;
        this.renderer = renderer;
    }
    get html() {
        return this.drawer.canvas;
    }
    render(drawer) {
        this.draw(this.drawer);
        drawer?.image(this.drawer);
    }
    update(cell) {
        this.renderer.render(cell, this.drawer, this.id);
    }
    zoom() {
        this.drawer.scale(1 / this.mapAccessor.map.zoom);
    }
    draw(drawer) {
        const map = this.mapAccessor.map.data;
        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderer.render({ column, row }, drawer, this.id);
            }
        }
    }
}
class DefaultLayerFactory {
    _type;
    mapAccessor;
    canvasProvider;
    renderer;
    layers = [];
    constructor(_type, mapAccessor, canvasProvider, renderer) {
        this._type = _type;
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
        this.renderer = renderer;
    }
    get type() {
        return this._type;
    }
    createRenderer(id) {
        return this.getLayer(id);
    }
    createDrawing(id) {
        return this.getLayer(id);
    }
    getLayer(id) {
        let layer = this.layers.find(l => l.id === id);
        if (!layer) {
            const map = this.mapAccessor.map, mapData = map.data, drawer = this.canvasProvider.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell, 1 / map.zoom);
            layer = {
                id,
                layer: new DefaultLayer(id, this.mapAccessor, drawer, this.renderer)
            };
            this.layers.push(layer);
        }
        return layer.layer;
    }
}
class GridLayer {
    id;
    mapAccessor;
    canvasProvider;
    wrapper;
    constructor(id, mapAccessor, canvasProvider) {
        this.id = id;
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
        const wrapper = document.createElement('div');
        wrapper.id = this.id;
        this.wrapper = wrapper;
    }
    get html() {
        return this.wrapper;
    }
    render(drawer) {
        drawer ??= this.setupCanvas();
        this.renderAtScale(drawer, this.mapAccessor.map.data.pixelsPerCell);
    }
    update() {
    }
    zoom() {
        this.setupCanvas();
    }
    renderAtScale(drawer, spacing) {
        const map = this.mapAccessor.map.data, style = {
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
    setupCanvas() {
        const map = this.mapAccessor.map, spacing = map.data.pixelsPerCell / map.zoom, drawer = this.canvasProvider.create(this.id + '-canvas', map.data.columns * spacing, map.data.rows * spacing);
        this.renderAtScale(drawer, spacing);
        this.wrapper.innerHTML = '';
        this.wrapper.append(drawer.canvas);
        return drawer;
    }
}
class GridLayerFactory {
    mapAccessor;
    canvasProvider;
    layers = [];
    constructor(mapAccessor, canvasProvider) {
        this.mapAccessor = mapAccessor;
        this.canvasProvider = canvasProvider;
    }
    get type() {
        return 'grid';
    }
    createRenderer(id) {
        return this.getLayer(id);
    }
    createDrawing(id) {
        return this.getLayer(id);
    }
    getLayer(id) {
        let layer = this.layers.find(l => l.id === id);
        if (!layer) {
            layer = {
                id,
                layer: new GridLayer(id, this.mapAccessor, this.canvasProvider)
            };
            this.layers.push(layer);
        }
        return layer.layer;
    }
}
class MapManagerFactory {
    store;
    canvasProvider;
    renderingStrategies;
    constructor(store, canvasProvider, renderingStrategies) {
        this.store = store;
        this.canvasProvider = canvasProvider;
        this.renderingStrategies = renderingStrategies;
    }
    create(map) {
        const mapAccessor = new MapAccessor(map, this.store);
        const grid = new GridLayerFactory(mapAccessor, this.canvasProvider);
        const drawerFactory = new CellDrawerFactory(mapAccessor);
        const cellRenderer = new CellRenderer(drawerFactory, this.renderingStrategies);
        const terrainLayer = new DefaultLayerFactory('terrain', mapAccessor, this.canvasProvider, cellRenderer);
        const textLayer = new DefaultLayerFactory('text', mapAccessor, this.canvasProvider, cellRenderer);
        const layers = [
            terrainLayer,
            textLayer,
            grid
        ];
        const layerFactory = new LayerFactory(layers);
        const layersManager = new LayersManager(layerFactory, mapAccessor);
        return new MapManager(mapAccessor, layersManager);
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
