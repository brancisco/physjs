import Vec from '@/Math/Vec3'
import { Collider } from './Collider'
import Quaternion from '@/Math/Quaternion'
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
    ang: Vec;
    sleeping: number;
    sleepThreshold: number;
    force: Vec;
    torque: Vec;
    gravity: Vec;

    constructor (mass?: number, gravity?: Vec) {
        super()
        this.force = new Vec()
        this.torque = new Vec()
        this.vel = new Vec()
        this.ang = new Vec()
        this.gravity = gravity || new Vec()
        this.mass = mass || 1
        this.sleeping = 0 
        this.sleepThreshold = 2
    }

    wake () {
        this.sleeping = 0
    }

    addSleepTime (time: number) {
        this.sleeping += time
    }

    decrementSleepTime (time: number) {
        this.sleeping = Math.max(0, this.sleeping - time)
    }

    isSleeping () {
        return this.sleeping > 0
    }
}