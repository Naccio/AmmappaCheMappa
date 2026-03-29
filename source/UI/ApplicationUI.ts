class ApplicationUI {
    constructor(private elements: UIElement[]) {
    }

    public build() {
        for (let element of this.elements) {
            document.body.appendChild(element.html);
        }
    }
}