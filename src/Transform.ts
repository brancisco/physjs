import Vec from '@/Math/Vec3'
import Quaternion from '@/Math/Quaternion'

export default class Transform {
    pos: Vec;
    scale: Vec;
    rot: Quaternion;
    constructor (position?: Vec, scale?: Vec, rotation?: Quaternion) {
        this.pos = position || new Vec()
        this.scale = scale || new Vec()
        this.rot = rotation || new Quaternion(0, 0, 0, 1)
    }
}