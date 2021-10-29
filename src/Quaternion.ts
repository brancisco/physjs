// https://mathworld.wolfram.com/Quaternion.html
// https://developerblog.myo.com/quaternions/
export default class Quaternion extends Array {
    
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super()
        Object.setPrototypeOf(this, Quaternion.prototype)
        this[0] = x
        this[1] = y
        this[2] = z
        this[3] = w
    }
}