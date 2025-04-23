class TextHelper {
    public static readonly layer = 'text';
    public static readonly objectType = 'text';

    public static isPlace(object: GridObject) : object is GridText {
        return object.type === this.objectType;
    }
    
}