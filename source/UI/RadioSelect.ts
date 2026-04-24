import { Observable } from "../Engine/Events/Observable";
import { Utilities } from "../Utilities/Utilities";
import { UIElement } from "./UIElement";

class RadioSelectItem<T> {
    constructor(
        public readonly value: T,
        public readonly radio: HTMLInputElement,
        public readonly label: HTMLLabelElement
    ) { }
}

export class RadioSelect<T> implements UIElement {
    private readonly container: HTMLDivElement;
    private readonly items: RadioSelectItem<T>[];

    private selected = -1;

    public constructor(
        private readonly target: Observable<T | undefined>,
        items: T[],
        labelFactory: (item: T, label: HTMLLabelElement) => void
    ) {
        const container = document.createElement('div'),
            name = Utilities.generateId('select'),
            selectItems: RadioSelectItem<T>[] = [];

        items.forEach(item => {
            const wrapper = document.createElement('div'),
                radio = document.createElement('input'),
                label = document.createElement('label'),
                id = Utilities.generateId('radio');

            radio.type = 'radio';
            radio.name = name;
            radio.value = id;
            radio.id = id;
            radio.className = 'label-radio';

            radio.onchange = () => {
                if (target.value !== item) {
                    // OPERATION ORDER IS IMPORTANT
                    this.selected = items.indexOf(item);
                    target.value = item;
                }
            };

            labelFactory(item, label);

            label.htmlFor = radio.id;

            wrapper.append(radio);
            wrapper.append(label);

            container.append(wrapper);
            selectItems.push(new RadioSelectItem(item, radio, label));
        });

        this.container = container;
        this.items = selectItems;

        target.subscribe(item => {
            if (item === undefined) {
                this.selected = -1;
                this.items.forEach(i => i.radio.checked = false);
            } else {
                const i = items.indexOf(item);

                if (this.selected !== i && i !== -1) {
                    // OPERATION ORDER IS IMPORTANT
                    this.selected = i;
                    this.items[i].label.click();
                }
            }
        });
    }

    public get html() {
        return this.container;
    }

    public disable(check: (item: T) => boolean) {
        let first: T | undefined = undefined,
            swap = false;

        this.items.forEach(item => {
            const disabled = check(item.value);

            item.radio.disabled = disabled;

            if (disabled) {
                if (item.value === this.target.value) {
                    swap = true;
                }
            } else {
                if (first === undefined) {
                    first = item.value;
                }
            }
        });

        if (this.target.value === undefined || swap) {
            this.target.value = first;
        }
    }
}