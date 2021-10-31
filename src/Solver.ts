import Collision from './Collision'
import Vec from './Vec'
import { ColliderObject, SolidBodyObject } from './Object'
import { Collider, SphereCollider, PlaneCollider } from './Collider'

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

        // if (depth < objectA.sleepThreshold && depth < objectA.sleepThreshold) return;
        if (objectA.collider instanceof SphereCollider &&
            objectB.collider instanceof SphereCollider) {
            const totalMass = objectA.mass + objectB.mass
            const aPercent = objectA.mass / totalMass
            const bPercent = objectB.mass / totalMass
            objectA.pos = objectA.pos.add(normal.mult(-depth*bPercent))
            objectB.pos = objectB.pos.add(normal.mult(depth*aPercent))
        }
        else if ((objectA.collider instanceof SphereCollider &&
                   objectB.collider instanceof PlaneCollider) ||
                   (objectA.collider instanceof PlaneCollider &&
                   objectB.collider instanceof SphereCollider)) {
            const sphere = (objectA.collider instanceof SphereCollider ? objectA : objectB) as SolidBodyObject;
            const plane = objectA.collider instanceof SphereCollider ? objectB : objectA
            const velNorm = sphere.vel.normal()
            sphere.pos = sphere.pos.add(Vec.mult(velNorm, -depth))
        }
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

        if (depth < objectA.sleepThreshold && depth < objectA.sleepThreshold) return;

        if (objectA.collider instanceof SphereCollider &&
            objectB.collider instanceof SphereCollider) {

            const JNum = Vec.dot(normal, Vec.sub(objectA.vel, objectB.vel))
            const JDenom = (1 / objectA.mass) + (1 / objectB.mass)
            const J = JNum / JDenom
            objectA.force = objectA.force.add(Vec.divide(Vec.mult(normal, -J), dt))
            objectB.force = objectB.force.add(Vec.divide(Vec.mult(normal, J), dt))
        }
        else if ((objectA.collider instanceof SphereCollider &&
                   objectB.collider instanceof PlaneCollider) ||
                   (objectA.collider instanceof PlaneCollider &&
                   objectB.collider instanceof SphereCollider)) {
            const sphere = (objectA.collider instanceof SphereCollider ? objectA : objectB) as SolidBodyObject;
            const plane = objectA.collider instanceof SphereCollider ? objectB : objectA
            const velFinal = sphere.vel.sub(normal.mult(2).mult(normal.mult(sphere.vel)))
            sphere.force = Vec.add(sphere.force,
                Vec.divide(
                    Vec.mult(Vec.sub(velFinal, sphere.vel), sphere.mass),
                    dt
                )
            )
            // console.log('sphere.force', sphere.force)
        }
    }
}