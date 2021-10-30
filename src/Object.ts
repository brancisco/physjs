import Vec from './Vec'
import { Collider } from './Collider'
import Quaternion from './Quaternion'

export class ColliderObject {
    collider?: Collider;
    pos: Vec;
    scale: Vec;
    mass: number;
    rot: Quaternion;
    constructor () {
        this.pos = new Vec()
        this.rot = new Quaternion()
    }
}

export class SolidBodyObject extends ColliderObject {
    vel: Vec;
    acc: Vec;

    constructor (mass?: number) {
        super()
        this.vel = new Vec()
        this.acc = new Vec()
        this.mass = mass || 1
    }
}