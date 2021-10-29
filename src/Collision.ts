import Vec from './Vec'

export default interface Collision<T> {
    objectA: T;
    objectB: T;
    a: Vec;
    b: Vec;
    depth: number;
    normal: Vec;
}