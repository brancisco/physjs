import Vec from './Vec'
import { Collider } from './Collider'
import Quaternion from './Quaternion'
import Transform from './Transform'

export class ColliderObject {
    collider?: Collider;
    mass: number;
    transform: Transform;

    constructor () {
        this.transform = new Transform()
        this.mass = Number.POSITIVE_INFINITY
    }

    get scale (): Vec {
        return this.transform.scale
    }

    get pos (): Vec {
        return this.transform.pos
    }

    get rot (): Quaternion {
        return this.transform.rot
    }

    set scale (scale: Vec) {
        this.transform.scale = scale
    }

    set pos (pos: Vec) {
        this.transform.pos = pos
    }

    set rot (rot: Quaternion) {
        this.transform.rot = rot
    }
}

export class SolidBodyObject extends ColliderObject {
    vel: Vec;
    acc: Vec;
    sleeping: boolean;
    sleepThreshold: number;
    force: Vec;

    constructor (mass?: number) {
        super()
        this.force = new Vec()
        this.vel = new Vec()
        this.acc = new Vec()
        this.mass = mass || 1
        this.sleeping = false
        this.sleepThreshold = 1
    }

    isSleeping () {
        return this.sleeping
    }
}