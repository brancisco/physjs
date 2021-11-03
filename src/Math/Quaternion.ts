// https://mathworld.wolfram.com/Quaternion.html
// https://developerblog.myo.com/quaternions/
import Vec3 from '@/Math/Vec3'

type Arr3 = [number, number, number]
type Arr4 = [number, number, number, number]

const cos = Math.cos
const sin = Math.sin

export default class Quaternion {
    s: number;
    v: Vec3;
    constructor(s?: number | Arr4, x?: number | Vec3 | Arr3, y?: number, z?: number) {
        if (s === undefined) {
            this.s = 0
            this.v = new Vec3()
        }
        else if (Array.isArray(s)) {
            this.s = s[0] || 0
            this.v = new Vec3(s.slice(1) as Arr3 || [0, 0, 0])
        } else if (Array.isArray(x)) {
            this.s = s
            this.v = new Vec3(x as Arr3)
        } else {
            this.s = s
            this.v = new Vec3(x, y, z)
        }
    }

    public get euler (): Vec3 {
        const q = this.normalize()
        // roll
        const yr = 2*(q.s*q.v[0] + q.v[1]*q.v[2])
        const xr = 1 - 2*(q.v[0]*q.v[0] + q.v[1]*q.v[1])

        // pitch
        const p = 2*(q.s*q.v[1] - q.v[2]*q.v[0])
        const pitch = Math.abs(p) >= 1 ? Math.sign(p)*Math.PI/2 : Math.asin(p)

        // yaw
        const yy = 2*(q.s*q.v[2] + q.v[0]*q.v[1])
        const xy = 1 - 2*(q.v[1]*q.v[1] + q.v[2]*q.v[2])

        return new Vec3(
            Math.atan2(yr, xr),
            pitch,
            Math.atan2(yy, xy)
        )
    }

    public set euler (v: Vec3 | Arr3) {
        const q = Quaternion.euler(v)
        this.s = q.s
        this.v[0] = q.v[0]
        this.v[1] = q.v[1]
        this.v[2] = q.v[2]
    }

    public static euler (v: Vec3 | Arr3 | number, w?: number, x?: number): Quaternion {
        let r, p, y;
        if (Array.isArray(v)) {
            r = v[0]/2
            p = v[1]/2
            y = v[2]/2
        } else {
            r = v/2
            p = w/2
            y = x/2
        }

        return new Quaternion(
            cos(r)*cos(p)*cos(y) + sin(r)*sin(p)*sin(y),
            sin(r)*cos(p)*cos(y) - cos(r)*sin(p)*sin(y),
            cos(r)*sin(p)*cos(y) + sin(r)*cos(p)*sin(y),
            cos(r)*cos(p)*sin(y) - sin(r)*sin(p)*cos(y)
        )
    }

    public add (q: Quaternion): Quaternion {
        return Quaternion.add(this, q)
    }

    public static add (q1: Quaternion, q2: Quaternion): Quaternion {
        return new Quaternion(q1.s + q2.s, q1.v.add(q2.v))
    }

    public sub (q: Quaternion): Quaternion {
        return Quaternion.sub(this, q)
    }

    public static sub (q1: Quaternion, q2: Quaternion): Quaternion {
        return new Quaternion(q1.s - q2.s, q1.v.sub(q2.v))
    }

    public mult (q: Quaternion | number): Quaternion {
        return Quaternion.mult(this, q)
    }

    public static mult (q1: Quaternion, q2: Quaternion | number): Quaternion {
        if (q2 instanceof Quaternion) {
            return new Quaternion(
                q1.s*q2.s - q1.v.dot(q2.v),
                q2.v.mult(q1.s).add(q1.v.mult(q2.s)).add(q1.v.cross(q2.v))
            )
        }
        return new Quaternion(q1.s*q2, q1.v.mult(q2))
    }

    public divide (v: number): Quaternion {
        return Quaternion.divide(this, v)
    }

    public static divide (q1: Quaternion, v: number): Quaternion {
        return new Quaternion(q1.s/v, q1.v.divide(v))
    }

    public conjugate (): Quaternion {
        return new Quaternion(this.s, -this.v[0], -this.v[1], -this.v[2])
    }

    public mag (): number {
        return Math.sqrt(Quaternion.mult(this, this.conjugate()).s)
    }

    public normalize (): Quaternion {
        return this.divide(this.mag())
    }

    public inv (): Quaternion {
        return Quaternion.divide(
            this.conjugate(),
            Quaternion.mult(this, this.conjugate()).s
        )
    }

    public static dot (q1: Quaternion, q2: Quaternion): number {
        return q1.s*q2.s + q1.v.dot(q2.v)
    }

    public dot(q: Quaternion): number {
        return Quaternion.dot(this, q)
    }

    public static rotate (theta: number, p: Quaternion | Arr4, q: Quaternion | Vec3 | Arr3): Quaternion {
        if (!(p instanceof Quaternion)) {
            p = new Quaternion(...p)
        }
        if (!(q instanceof Quaternion)) {
            q = (new Quaternion(
                Math.cos(0.5*theta),
                Vec3.mult(q as Vec3, Math.sin(0.5*theta))
            )).normalize()
        } else {
            q = (new Quaternion(
                Math.cos(0.5*theta),
                Vec3.mult(q.v, Math.sin(0.5*theta))
            )).normalize()
        }
        return q.mult(p).mult(q.inv())
    }

    public rotate (theta: number, q: Quaternion | Vec3 | Arr3): Quaternion {
        return Quaternion.rotate(theta, this, q)
    }
}