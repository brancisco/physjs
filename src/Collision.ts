import Vec from '@/Math/Vec3'

export default interface Collision<T> {
    objectA: T;
    objectB: T;
    a: Vec;
    b: Vec;
    depth: number;
    normal: Vec;
}