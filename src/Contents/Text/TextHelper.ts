class TextHelper {
    public static readonly layer = 'terrain';
    public static readonly objectType = 'text';

    public static isPlace(object: GridObject) : object is GridText {
        return object.type === this.objectType;
    }
    
}