class ApplicationUI {
    constructor(private elements: UIElement[]) {
    }

    public build() {
        for (let element of this.elements) {
            const htmlElement = element.build();
            document.body.appendChild(htmlElement);
        }
    }
}