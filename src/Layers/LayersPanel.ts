class LayersPanel implements UIElement {
    public constructor(private layers: LayersManager) {
        layers.onChange(() => this.build());
    }

    build(): void {
        document.getElementById('layers')?.remove();

        const container = document.createElement('div');

        container.id = 'layers';

        for (let layer of this.layers.layers) {
            const id = layer.data.id,
                wrapper = document.createElement('div'),
                check = document.createElement('input'),
                label = document.createElement('label');

            check.type = 'checkbox';
            check.name = 'active-tool';
            check.value = id;
            check.id = id;

            label.htmlFor = id;
            label.innerText = layer.data.name;
            label.title = layer.data.name;

            wrapper.append(check);
            wrapper.append(label);
            container.append(wrapper);
        }

        document.body.append(container);
    }
}