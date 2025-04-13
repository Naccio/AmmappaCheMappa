class ApplicationUI {
    constructor(private elements: UIElement[]) {
    }

    public build() {
        for (let element of this.elements) {
            element.build();
        }
    }
}