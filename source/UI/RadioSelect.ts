import { Observable } from "../Engine/Events/Observable";
import { Utilities } from "../Utilities/Utilities";
import { UIElement } from "./UIElement";

class RadioSelectItem<T> implements UIElement {
    private readonly container: HTMLDivElement;

    constructor(
        public readonly value: T,
        public readonly radio: HTMLInputElement,
        public readonly label: HTMLLabelElement
    ) {
        const container = document.createElement('div');

        container.append(radio);
        container.append(label);

        this.container = container;
    }

    public get html() {
        return this.container;
    }
}

export class RadioSelect<T> implements UIElement {
    private readonly container: HTMLDivElement;
    private readonly items: RadioSelectItem<T>[];
    private readonly name: string;

    private selected?: T;

    public constructor(
        private readonly target: Observable<T | undefined>,
        items: T[],
        private readonly labelFactory: (item: T, label: HTMLLabelElement) => void,
        private readonly wrapperFactory?: (item: T, wrapper: HTMLDivElement) => void
    ) {
        this.name = Utilities.generateId('select');
        this.container = document.createElement('div');
        this.items = [];

        items.forEach(item => this.add(item));

        target.subscribe(item => {
            if (item === undefined) {
                this.selected = undefined;
                this.items.forEach(i => i.radio.checked = false);
            } else {
                const i = items.indexOf(item);

                if (this.selected !== item) {
                    // OPERATION ORDER IS IMPORTANT
                    this.selected = item;
                    this.items[i].radio.checked = true;
                }
            }
        });
    }

    public get html() {
        return this.container;
    }

    public add(item: T) {
        const radio = document.createElement('input'),
            label = document.createElement('label'),
            id = Utilities.generateId('radio');

        radio.type = 'radio';
        radio.name = this.name;
        radio.value = id;
        radio.id = id;
        radio.className = 'label-radio';
        radio.checked = item === this.target.value;

        radio.onchange = () => {
            if (this.target.value !== item) {
                // OPERATION ORDER IS IMPORTANT
                this.selected = item;
                this.target.value = item;
            }
        };

        this.labelFactory(item, label);

        label.htmlFor = radio.id;

        const radioItem = new RadioSelectItem(item, radio, label);

        if (this.wrapperFactory) {
            this.wrapperFactory(item, radioItem.html);
        }

        this.container.append(radioItem.html);
        this.items.push(radioItem);
    }

    public disable(check: (item: T) => boolean) {
        let swap = false;

        this.items.forEach(item => {
            const disabled = check(item.value);

            item.radio.disabled = disabled;

            if (disabled && item.value === this.target.value) {
                swap = true;
            }
        });

        if (this.target.value === undefined || swap) {
            this.selectFirst();
        }
    }

    public remove(item: T) {
        const index = this.items.findIndex(i => i.value === item);

        console.log(item);
        console.log(index);

        if (index !== -1) {
            const removed = this.items.splice(index, 1);

            removed[0].html.remove();

            if (this.target.value === item) {
                this.selectFirst();
            }
        }
    }

    private selectFirst() {
        const item = this.items.find(i => !i.radio.disabled);

        this.target.value = item?.value;
    }
}