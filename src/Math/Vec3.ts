export default class Vec extends Array {

    constructor (x?: number, y?: number, z?: number);
    constructor (arr?: [number, number, number]);

    constructor(x: any = 0, y: any = 0, z: any = 0) {
        super()
        Object.setPrototypeOf(this, Vec.prototype)
        if (Array.isArray(x)) {
            this[0] = x[0]
            this[1] = x[1]
            this[2] = x[2]
        } else {
            this[0] = x
            this[1] = y
            this[2] = z
        }
    }

    public get x () : number {
        return this[0]
    }

    public get y () : number {
        return this[1]
    }

    public get z () : number {
        return this[2]
    }

    public set x (n: number) {
        this[0] = n
    }

    public set y (n: number) {
        this[1] = n
    }

    public set z (n: number) {
        this[2] = n
    }

    public mag(): number {
        return Math.sqrt(
            Vec.dot(this, this)
        )
    }

    public normal(): Vec {
        const mag = this.mag()
        return new Vec(
            this[0] / mag,
            this[1] / mag,
            this[2] / mag
        )
    }

    public abs(): Vec {
        return new Vec(
            Math.abs(this[0]),
            Math.abs(this[1]),
            Math.abs(this[2])
        )
    }

    public add (v: Vec): Vec;
    public add (v: number): Vec;

    public add (v: any): Vec {
        return Vec.add(this, v)
    }

    public sub (v: Vec): Vec;
    public sub (v: number): Vec;

    public sub (v: any): Vec {
        return Vec.sub(this as Vec, v)
    }

    public mult (v: Vec): Vec;
    public mult (v: number): Vec;

    public mult (v: any): Vec {
        return Vec.mult(this as Vec, v)
    }

    public divide (v: Vec): Vec;
    public divide (v: number): Vec;

    public divide (v: any): Vec {
        return Vec.divide(this as Vec, v)
    }

    public dot (v: Vec): number {
        return Vec.dot(this, v)
    }

    public cross (v: Vec): Vec {
        return Vec.cross(this, v)
    }

    public static add (v1: number, v2: Vec): Vec;
    public static add (v1: Vec, v2: number): Vec;
    public static add (v1: Vec, v2: Vec): Vec

    public static add (v1: any, v2: any): Vec {
        if (Array.isArray(v1) && Array.isArray(v2)) {
            return new Vec([
                v1[0] + v2[0],
                v1[1] + v2[1],
                v1[2] + v2[2]
            ])
        } else {
            const [vector, number] = Array.isArray(v1) ? [v1, v2] : [v2, v1]
            return new Vec([
                vector[0] + number,
                vector[1] + number,
                vector[2] + number
            ])
        }
    }

    public static sub (v1: number, v2: Vec): Vec;
    public static sub (v1: Vec, v2: number): Vec;
    public static sub (v1: Vec, v2: Vec): Vec

    public static sub (v1: any, v2: any): Vec {
        if (Array.isArray(v1) && Array.isArray(v2)) {
            return new Vec([
                v1[0] - v2[0],
                v1[1] - v2[1],
                v1[2] - v2[2]
            ])
        } else if (Array.isArray(v1)) {
            return new Vec([
                v1[0] - v2,
                v1[1] - v2,
                v1[2] - v2
            ])
        } else {
            return new Vec([
                v1 - v2[0],
                v1 - v2[1],
                v1 - v2[2]
            ])
        }
    }

    public static mult (v1: Vec, value: Vec): Vec;
    public static mult (v1: Vec, value: number): Vec;
    public static mult (v1: number, value: Vec): Vec;

    public static mult (v1: any, v2: any) {
        if (Array.isArray(v1) && Array.isArray(v2)) {
            return new Vec([
                v1[0] * v2[0],
                v1[1] * v2[1],
                v1[2] * v2[2]
            ])
        } else {
            const [vector, number] = Array.isArray(v1) ? [v1, v2] : [v2, v1]
            return new Vec([
                vector[0] * number,
                vector[1] * number,
                vector[2] * number
            ])
        }
    }

    public static dot (v1: Vec, v2: Vec): number {
        const mult = Vec.mult(v1, v2)
        return mult[0] + mult[1] + mult[2]
    }

    public static cross (v1: Vec, v2: Vec): Vec {
        return new Vec(
            v1[1]*v2[2] - v1[2]*v2[1],
            v1[2]*v2[0] - v1[0]*v2[2],
            v1[0]*v2[1] - v1[1]*v2[0]
        )
    }

    public static divide (v1: Vec, v2: Vec): Vec;
    public static divide (v1: Vec, v2: number): Vec;
    public static divide (v1: number, v2: Vec): Vec;

    public static divide (v1: any, v2: any) {
        if (Array.isArray(v1) && Array.isArray(v2)) {
            return new Vec([
                v1[0] / v2[0],
                v1[1] / v2[1],
                v1[2] / v2[2]
            ])
        } else if (Array.isArray(v1)) {
            return new Vec([
                v1[0] / v2,
                v1[1] / v2,
                v1[2] / v2
            ])
        } else {
            return new Vec([
                v1 / v2[0],
                v1 / v2[1],
                v1 / v2[2]
            ])
        }
    }

    public static max (v1: Vec, value: Vec): Vec;
    public static max (v1: Vec, value: number): Vec;

    public static max (v1: Vec, value: any): Vec {
        if (Array.isArray(value)) {
            return new Vec([
                Math.max(v1[0], value[0]),
                Math.max(v1[1], value[1]),
                Math.max(v1[2], value[2])
            ])
        } else {
            return new Vec([
                Math.max(v1[0], value),
                Math.max(v1[1], value),
                Math.max(v1[2], value)
            ])
        }
    }

    public static min (v1: Vec, value: Vec): Vec;
    public static min (v1: Vec, value: number): Vec;

    public static min (v1: Vec, value: any): Vec {
        if (Array.isArray(value)) {
            return new Vec([
                Math.min(v1[0], value[0]),
                Math.min(v1[1], value[1]),
                Math.min(v1[2], value[2])
            ])
        } else {
            return new Vec([
                Math.min(v1[0], value),
                Math.min(v1[1], value),
                Math.min(v1[2], value)
            ])
        }
    }

    public static bound (v: Vec, lower: number, upper: number): Vec;
    public static bound (v: Vec, lower: Vec, upper: Vec): Vec;
    public static bound (v: Vec, bound: Vec): Vec;


    public static bound (v: Vec, lower: any, upper?: any): Vec {
        if (upper === undefined) {
            return new Vec(
                Math.max(Math.min(v[0], lower[0]), -lower[0]),
                Math.max(Math.min(v[1], lower[1]), -lower[1]),
                Math.max(Math.min(v[2], lower[2]), -lower[2])
            )
        }
        else if (Array.isArray(upper)) {
            return new Vec(
                Math.max(Math.min(v[0], upper[0]), lower[0]),
                Math.max(Math.min(v[1], upper[1]), lower[1]),
                Math.max(Math.min(v[2], upper[2]), lower[2])
            )
        }
        return new Vec(
            Math.max(Math.min(v[0], upper), lower),
            Math.max(Math.min(v[1], upper), lower),
            Math.max(Math.min(v[2], upper), lower)
        )
    }

}