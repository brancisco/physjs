import Collision from './Collision'
import Vec from '@/Math/Vec3'
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
        const { objectA, objectB, a, b, depth, normal } = collision

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
            sphere.pos = sphere.pos.add(normal.mult(depth))
        }
    }
}

export class ImpulseSolver extends Solver {
    constructor () {
        super()
    }
    solve (collision: Collision<SolidBodyObject>, dt: number) {
        const { objectA, objectB, a, b, depth, normal } = collision

        if (objectA.collider instanceof SphereCollider &&
            objectB.collider instanceof SphereCollider) {
            const relativeVelocity = Vec.sub(objectB.vel, objectA.vel)
            const velNormal = normal.dot(relativeVelocity)
            if (velNormal > 0) return;
            const e = Math.min(objectA.restitution, objectB.restitution)
            const JNum = -(1 + e) * velNormal
            const JDenom = (objectA.invMass) + (objectB.invMass)
            const J = (JNum / JDenom)
            objectA.force = objectA.force.sub(normal.mult(J).divide(dt))
            objectB.force = objectB.force.add(normal.mult(J).divide(dt))
        }
        else if ((objectA.collider instanceof SphereCollider &&
                   objectB.collider instanceof PlaneCollider) ||
                   (objectA.collider instanceof PlaneCollider &&
                   objectB.collider instanceof SphereCollider)) {
            const sphere = (objectA.collider instanceof SphereCollider ? objectA : objectB) as SolidBodyObject;
            const plane = objectA.collider instanceof SphereCollider ? objectB : objectA
            const sphereVelAdjGrav = sphere.vel.add(sphere.gravity.mult(dt/2))
            const velFinal = sphere.vel.sub(
                normal.mult(2).mult(normal.dot(sphereVelAdjGrav))
            ).mult(new Vec([0.95, 0.4, 0.95]))
            sphere.force = Vec.add(sphere.force,
                Vec.divide(
                    Vec.mult(Vec.sub(velFinal, sphere.vel), sphere.mass),
                    dt
                )
            )
        }
    }
}