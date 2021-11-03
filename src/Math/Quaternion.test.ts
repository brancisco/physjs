import Vec3 from './Vec3'
import Quaternion from './Quaternion'

describe('test Quaternion class', () => {
    describe('initialize Quaternion class', () => {
        it('should initialize with all zeros when no args passed', () => {
            const q = new Quaternion()
            expect(q).toEqual(expect.objectContaining({
                s: 0,
                v: new Vec3()
            }))
        })

        it('should initialize with array', () => {
            const expected: [number, number, number, number] = [1, 2, 3, 4]
            const q = new Quaternion(expected)
            expect(q).toEqual(expect.objectContaining({
                s: expected[0],
                v: new Vec3(expected.slice(1) as [number, number, number])
            }))
        })

        it('should initialize with two arguments, number and array[3]', () => {
            const expected: [number, number, number, number] = [1, 2, 3, 4]
            const q = new Quaternion(expected[0], expected.slice(1) as [number, number, number])
            expect(q).toEqual(expect.objectContaining({
                s: expected[0],
                v: new Vec3(expected.slice(1) as [number, number, number])
            }))
        })

        it('should initialize with 4 seperate arguments', () => {
            const q = new Quaternion(1, 2, 3, 4)
            expect(q).toEqual(expect.objectContaining({
                s: 1,
                v: new Vec3([2, 3, 4])
            }))
        })
    })

    describe('should perform quaternion opperations', () => {
        it('should add another quaternion', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            const q2 = new Quaternion(4, 3, 2, 1)
            expect(q1.add(q2)).toEqual(expect.objectContaining({
                s: 5,
                v: [5, 5, 5]
            }))
        })

        it('should subtract another quaternion', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            const q2 = new Quaternion(4, 3, 2, 1)
            expect(q1.sub(q2)).toEqual(expect.objectContaining({
                s: -3,
                v: [-1, 1, 3]
            }))
        })

        it('should multiply another quaternion', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            const q2 = new Quaternion(2, 3, 4, 5)
            expect(q1.mult(q2)).toEqual(expect.objectContaining({
                s: q1.s * q2.s - q1.v.dot(q2.v),
                v: q2.v.mult(q1.s).add(q1.v.mult(q2.s)).add(q1.v.cross(q2.v))
            }))
        })

        it('should multiply a scalar', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            const s = 5
            expect(q1.mult(s)).toEqual(expect.objectContaining({
                s: q1.s*s,
                v: q1.v.mult(s)
            }))
        })

        it('should divide a scalar', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            const s = 5
            expect(q1.divide(s)).toEqual(expect.objectContaining({
                s: q1.s/s,
                v: q1.v.divide(s)
            }))
        })

        it('should return its conjugate', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            expect(q1.conjugate()).toEqual(expect.objectContaining({
                s: q1.s,
                v: new Vec3(-q1.v.x, -q1.v.y, -q1.v.z)
            }))
        })

        it('should have a product between self and conjugate of [s^2 + u^2, 0]', () => {
            const q = new Quaternion(1, 2, 3, 4)
            expect(q.mult(q.conjugate())).toEqual(expect.objectContaining({
                s: q.s*q.s + q.v.dot(q.v),
                v: new Vec3()
            }))
        })

        it('should return its magnitude', () => {
            const q = new Quaternion(1, 2, 3, 4)
            expect(q.mag()).toEqual(Math.sqrt(q.s*q.s + q.v.dot(q.v)))
        })

        it('should return itself normalized', () => {
            const q = new Quaternion(1, 2, 3, 4)
            expect(q.normalize()).toEqual(q.divide(Math.sqrt(q.s*q.s + q.v.dot(q.v))))
        })

        it('should return its inverse', () => {
            const q = new Quaternion(1, 2, 3, 4)
            expect(q.inv()).toEqual(Quaternion.divide(
                q.conjugate(),
                Quaternion.mult(q.conjugate(), q).s
            ))
        })

        it('should have inverse = conjugate when it is in unit-norm form', () => {
            const q = new Quaternion(2, 2, -2, 4).normalize()
            const inv = q.inv()
            const conj = q.conjugate()
            expect(inv.s).toBeCloseTo(conj.s, 5)
            expect(inv.v.x).toBeCloseTo(conj.v.x, 5)
            expect(inv.v.y).toBeCloseTo(conj.v.y, 5)
            expect(inv.v.z).toBeCloseTo(conj.v.z, 5)
        })

        it('should perform dot product', () => {
            const q1 = new Quaternion(1, 2, 3, 4)
            const q2 = new Quaternion(5, -6, 7, 8)
            expect(q1.s*q2.s + q1.v.dot(q2.v)).toEqual(q1.dot(q2))
        })

        it('should rotate a vector', () => {
            let p = new Quaternion(0, 2, 0, 0)
            let q = new Vec3(0, 0, 1)
            let pp = Quaternion.rotate(45 * Math.PI / 180, p, q)
            expect(pp.v.x).toBeCloseTo(Math.sqrt(2), 5)
            expect(pp.v.y).toBeCloseTo(Math.sqrt(2), 5)
            expect(pp.v.z).toEqual(0)

            p = new Quaternion(0, 0, 1, 0)
            q = new Vec3(1, 0, 0)
            pp = p.rotate(90 * Math.PI / 180, q)
            expect(pp.v.x).toBeCloseTo(0, 5)
            expect(pp.v.y).toBeCloseTo(0, 5)
            expect(pp.v.z).toBeCloseTo(1, 5)
        })
    })

    describe('test Quaternion properties', () => {
        it.todo('should be able to set euler angles')

        it.todo('should be able to get euler angles')
    })
})