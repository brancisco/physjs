import Collision from './Collision'
import Vec from './Vec'
import { ColliderObject, SolidBodyObject } from './Object'


export class Solver {
    constructor () {

    }
    solve (collision: Collision<ColliderObject>, dt: number) {

    }
}

export class PositionCorrectionSolver extends Solver {
    constructor () {
        super()
    }
    solve (collision: Collision<ColliderObject>, dt: number) {
        // we're just doing a sphere for now, but we need to handle all cases
        // console.log(collision)
        const { objectA, objectB, a, b, depth, normal } = collision
        const halfDepth = depth / 2
        const totalMass = objectA.mass + objectB.mass
        const aPercent = objectA.mass / totalMass
        const bPercent = objectB.mass / totalMass
        objectA.pos = Vec.add(objectA.pos, Vec.mult(normal, -depth*bPercent))
        objectB.pos = Vec.add(objectB.pos, Vec.mult(normal, depth*aPercent))
    }
}

export class ImpulseSolver extends Solver {
    constructor () {
        super()
    }
    solve (collision: Collision<SolidBodyObject>, dt: number) {
        // we're just doing a sphere for now, but we need to handle all cases
        // console.log(collision)
        const { objectA, objectB, a, b, depth, normal } = collision

        const JNum = Vec.dot(normal, Vec.sub(objectA.vel, objectB.vel))
        const JDenom = (1 / objectA.mass) + (1 / objectB.mass)
        const J = JNum / JDenom
        objectA.vel = Vec.add(objectA.vel, Vec.mult(normal, J / -objectA.mass))
        objectB.vel = Vec.add(objectB.vel, Vec.mult(normal, J / objectB.mass))
    }
}