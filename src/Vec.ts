export default class Vec extends Array {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super()
        Object.setPrototypeOf(this, Vec.prototype)
        this[0] = x
        this[1] = y
        this[2] = z
    }

    public x() : number {
        return this[0]
    }

    public y() : number {
        return this[1]
    }

    public z() : number {
        return this[2]
    }

    public mag(): number {
        return Math.sqrt(
            Math.pow(this[0], 2) +
            Math.pow(this[1], 2) +
            Math.pow(this[2], 2)
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

    public static add (v1: Vec, v2: Vec): Vec {
        return new Vec(...[
            v1[0] + v2[0],
            v1[1] + v2[1],
            v1[2] + v2[2]
        ])
    }

    public static sub (v1: Vec, v2: Vec): Vec {
        return new Vec(...[
            v1[0] - v2[0],
            v1[1] - v2[1],
            v1[2] - v2[2]
        ])
    }

    public static mult (v1: Vec, value: Vec): Vec;
    public static mult (v1: Vec, value: number): Vec;

    public static mult (v1: Vec, value: any) {
        if (value instanceof Array) {
            return new Vec(...[
                v1[0] * value[0],
                v1[1] * value[1],
                v1[2] * value[2]
            ])
        } else {
            return new Vec(...[
                v1[0] * value,
                v1[1] * value,
                v1[2] * value
            ])
        }
    }

    public static dot (v1: Vec, v2: Vec): number {
        const mult = Vec.mult(v1, v2)
        return mult[0] + mult[1] + mult[2]
    }

    public static divide (v1: Vec, value: Vec): Vec;
    public static divide (v1: Vec, value: number): Vec;
    public static divide (value: number, v: number): Vec;

    public static divide (v1: any, v2: any) {
        if (v1 instanceof Array && v2 instanceof Array) {
            return new Vec(...[
                v1[0] / v2[0],
                v1[1] / v2[1],
                v1[2] / v2[2]
            ])
        } else if (v1 instanceof Array) {
            return new Vec(...[
                v1[0] / v2,
                v1[1] / v2,
                v1[2] / v2
            ])
        } else if (v2 instanceof Array) {
            return new Vec(...[
                v1 / v2[0],
                v1 / v2[1],
                v1 / v2[2]
            ])
        }
    }

    public static max (v1: Vec, value: Vec): Vec;
    public static max (v1: Vec, value: number): Vec;

    public static max (v1: Vec, value: any): Vec {
        if (value instanceof Array) {
            return new Vec(...[
                Math.max(v1[0], value[0]),
                Math.max(v1[1], value[1]),
                Math.max(v1[2], value[2])
            ])
        } else {
            return new Vec(...[
                Math.max(v1[0], value),
                Math.max(v1[1], value),
                Math.max(v1[2], value)
            ])
        }
    }

    public static min (v1: Vec, value: Vec): Vec;
    public static min (v1: Vec, value: number): Vec;

    public static min (v1: Vec, value: any): Vec {
        if (value instanceof Array) {
            return new Vec(...[
                Math.min(v1[0], value[0]),
                Math.min(v1[1], value[1]),
                Math.min(v1[2], value[2])
            ])
        } else {
            return new Vec(...[
                Math.min(v1[0], value),
                Math.min(v1[1], value),
                Math.min(v1[2], value)
            ])
        }
    }

}