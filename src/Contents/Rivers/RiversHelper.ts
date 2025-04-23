class RiversHelper {
    public static readonly layer = 'terrain';
    public static readonly objectType = 'river';

    public static isRiver(object: MapObject) : object is River {
        return object.type === this.objectType;
    }
    
}