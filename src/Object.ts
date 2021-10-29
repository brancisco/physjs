import Vec from './Vec'
import { Collider } from './Collider'

export default class Object {
    pos: Vec;
    vel: Vec;
    acc: Vec;
    rot: Vec;
    mass: number;
    collider?: Collider;

    constructor (mass?: number) {
        this.pos = new Vec()
        this.vel = new Vec()
        this.acc = new Vec()
        this.rot = new Vec()
        this.mass = mass || 1
    }
}