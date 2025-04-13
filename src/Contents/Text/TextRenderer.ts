class TextRenderer extends GenericObjectRenderer<GridText> {
    private readonly lineWidth = 2;

    protected is(object: GridObject) : object is GridText {
        return object.type === TextHelper.objectType;
    }

    protected draw(text: GridText, drawer: CellDrawer) {
        drawer.text(text.position, text.value, text.fontSize);
    }
}