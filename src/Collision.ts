import Vec from './Vec'
import Object from './Object'

export default interface Collision {
    objectA: Object;
    objectB: Object;
    a: Vec;
    b: Vec;
    depth: number;
    normal: Vec;
}