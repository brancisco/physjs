import Vec from './Vec'
import Quaternion from './Quaternion'

export default class Transform {
    pos: Vec;
    scale: Vec;
    rot: Quaternion;
    constructor (position?: Vec, scale?: Vec, rotation?: Quaternion) {
        this.pos = position || new Vec()
        this.scale = scale || new Vec()
        this.rot = rotation || new Quaternion()
    }
}