import { convertTo2DArray } from '@/core/lib/array';

describe('convertTo2DArray', () => {
    it('should convert a flat array to a 2D array with the specified number of columns', () => {
        const flatArray = [1, 2, 3, 4, 5, 6];
        const numColumns = 2;
        const expectedOutput = [
            [1, 2],
            [3, 4],
            [5, 6]
        ];
        expect(convertTo2DArray(flatArray, numColumns)).toEqual(expectedOutput);
    });

    it('should handle an empty array', () => {
        const flatArray: Array<unknown> = [];
        const numColumns = 3;
        const expectedOutput: Array<unknown> = [];
        expect(convertTo2DArray(flatArray, numColumns)).toEqual(expectedOutput);
    });

    it('should handle a flat array that does not divide evenly by the number of columns', () => {
        const flatArray = [1, 2, 3, 4, 5];
        const numColumns = 2;
        const expectedOutput = [
            [1, 2],
            [3, 4],
            [5]
        ];
        expect(convertTo2DArray(flatArray, numColumns)).toEqual(expectedOutput);
    });

    it('should handle a flat array with one element', () => {
        const flatArray = [1];
        const numColumns = 3;
        const expectedOutput = [
            [1]
        ];
        expect(convertTo2DArray(flatArray, numColumns)).toEqual(expectedOutput);
    });

    it('should handle a flat array with more columns than elements', () => {
        const flatArray = [1, 2];
        const numColumns = 5;
        const expectedOutput = [
            [1, 2]
        ];
        expect(convertTo2DArray(flatArray, numColumns)).toEqual(expectedOutput);
    });
});
