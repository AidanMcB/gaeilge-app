import { calcPercent, randomInt, randomizeArr } from '../utils/helper';
import { describe, expect, test } from 'vitest'


describe('randomInt()', () => {
    test('returns random number less than 10', () => {
        expect(randomInt(10)).toBeLessThan(10);
    });
    
    test('returns random number greater than 0', () => {
        expect(randomInt(10)).toBeGreaterThanOrEqual(0);
    });
});

describe('randomizeArr()', () => {
    // impossible to truly test without rewriting same logic
    // -> ensure the array does not gain or lose any elements
    test('returns given array without removing any elements', () => {
        const arr = [1,2,3,4];
        const randomArr = randomizeArr(arr);
        expect(randomArr).toHaveLength(4);
        randomArr.forEach(el => {
            expect(arr.includes(el)).toBeTruthy();
        });
    });
});

describe('calPercent()', () => {
    test('returns a percentage value of two numbers', () => {
        expect(calcPercent(2,10)).toBe(20);
    });

    test('returns a percentage value of two number, if first number is larger than return is over 100', () => {
        expect(calcPercent(10,2)).toBe(500);
    });
});

