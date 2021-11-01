import Vec from './Vec3'

describe('test Vec class', () => {
    describe('initialize Vec class', () => {
        it('should initialize with all zeros when no args passed', () => {
            const vec = new Vec()
            expect(vec).toEqual([0, 0, 0])
        })
        it('should initialize with array values initialized with array', () => {
            const expected = [1, 2, 3]
            const vec = new Vec(expected)
            expect(vec).toEqual(expected)
        })
        it('should initialize with 3 seperate arguments', () => {
            const vec = new Vec(1, 2, 3)
            expect(vec).toEqual([1, 2, 3])
        })
    })

    describe('get and set by x, y, z', () => {
        test.each([
            ['get', 'x', 6],
            ['get', 'y', 4],
            ['get', 'z', 2],
        ])('should %s %p using dot notation', (a, b, expected) => {
            const vec = new Vec([6, 4, 2])
            expect(vec[b]).toEqual(expected)
        })

        test.each([
            ['set', 'x', 1, [1, 4, 2]],
            ['set', 'y', 1, [6, 1, 2]],
            ['set', 'z', 1, [6, 4, 1]],
        ])('should %s %p using dot notation', (a, b, c, expected) => {
            const vec = new Vec([6, 4, 2])
            vec[b] = c
            expect(vec).toEqual(expected)
        })

        test.each([
            ['get', 'x', 0, 6],
            ['get', 'y', 1, 4],
            ['get', 'z', 2, 2],
        ])('should %s %p using array notation', (a, b, c, expected) => {
            const vec = new Vec([6, 4, 2])
            expect(vec[c]).toEqual(expected)
        })

        test.each([
            ['set', 'x', 0, 1, [1, 4, 2]],
            ['set', 'y', 1, 1, [6, 1, 2]],
            ['set', 'z', 2, 1, [6, 4, 1]],
        ])('should %s %p using array notation', (a, b, c, d, expected) => {
            const vec = new Vec([6, 4, 2])
            vec[c] = d
            expect(vec).toEqual(expected)
        })
    })

    describe('perform vector opperations', () => {
        const initArr = [1, 3, 9]
        const vec = new Vec(initArr)
        test.each([
            ['vector', [3, 2, 1], [4, 5, 10]],
            ['number', 5, [6, 8, 14]],
        ])('should add a %p', (a, b, expected) => {
            expect(vec.add(b)).toEqual(expected)
        })

        test.each([
            ['vector', [3, 2, 1], [-2, 1, 8]],
            ['number', 3, [-2, 0, 6]],
        ])('should subtract a %p', (a, b, expected) => {
            expect(vec.sub(b)).toEqual(expected)
        })

        test.each([
            ['vector', [10, 100, 1000], [10, 300, 9000]],
            ['number', 10, [10, 30, 90]],
        ])('should multiply a %p', (a, b, expected) => {
            expect(vec.mult(b)).toEqual(expected)
        })

        test.each([
            ['vector', [1, 3, 9], [1, 1, 1]],
            ['number', 3, [1/3, 1, 3]],
        ])('should divide a %p', (a, b, expected) => {
            expect(vec.divide(b)).toEqual(expected)
        })

        it('should dot another vector', () => {
            expect(vec.dot(initArr)).toEqual(91)
        })

        it('should return its magnitude', () => {
            expect(vec.mag()).toEqual(Math.sqrt(
                Math.pow(vec[0], 2) + 
                Math.pow(vec[1], 2) + 
                Math.pow(vec[2], 2)))
        })

        it('should return its normal', () => {
            const mag = Math.sqrt(
                Math.pow(vec[0], 2) + 
                Math.pow(vec[1], 2) + 
                Math.pow(vec[2], 2))
            expect(vec.normal()).toEqual([
                vec[0] / mag,
                vec[1] / mag,
                vec[2] / mag,
            ])
        })

        it('should return absolute value', () => {
            const vec = new Vec([-3, 10, -20])
            expect(vec.abs()).toEqual([3, 10, 20])
        })
    })
})