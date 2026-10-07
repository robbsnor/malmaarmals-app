export class ArrayHelper {
    static arrayToIndexedObject(arr: Array<string | number>): Record<number, string> {
        return arr.reduce<Record<number, string>>((acc, value, index) => {
            acc[index] = String(value);
            return acc;
        }, {});
    }
}
