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
    percent: number;
    slop: number;

    constructor () {
        super()
        // percentage amount to correct objects by
        this.percent = 0.15
        // amount of overlap in objects allowed
        this.slop = 0.05
    }
    solve (collision: Collision<ColliderObject>, dt: number) {
        const { objectA, objectB, a, b, depth, normal } = collision

        if (objectA.collider instanceof SphereCollider &&
            objectB.collider instanceof SphereCollider) {
            const totalMass = objectA.mass + objectB.mass
            const correction = normal.mult(Math.max(depth - this.slop, 0) * totalMass * this.percent)
            objectA.pos = objectA.pos.sub(correction.mult(objectA.invMass))
            objectB.pos = objectB.pos.add(correction.mult(objectB.invMass))
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

    setSlop (slop: number) {
        this.slop = Math.min(Math.max(0.01, slop), 0.3)
    }

    setPercent (percent: number) {
        this.percent = Math.min(Math.max(0.1, percent), 0.8)
    }
}

export class ImpulseSolver extends Solver {
    rotational: boolean;

    constructor (rotational: boolean = true) {
        super()
        this.rotational = rotational
    }

    solve (collision: Collision<SolidBodyObject>, dt: number) {
        const { objectA, objectB, a, b, depth, normal } = collision
        let velA = new Vec()
        let velB = new Vec()
        if (objectA.vel) {
            velA = objectA.vel
        }
        if (objectB.vel) {
            velB = objectB.vel
        }

        let relativeVelocity = Vec.sub(velB, velA)
        const velNormal = normal.dot(relativeVelocity)
        if (velNormal > 0) return;
        const e = Math.min(objectA.restitution, objectB.restitution)
        const JNum = -(1 + e) * velNormal
        let JDenom = (objectA.invMass + objectB.invMass)
        let rap, rbp, J
        if (this.rotational) {
            // rotational impulse
            const rap = a.sub(objectA.pos)
            const rbp = b.sub(objectB.pos)
            const rapn = rap.cross(normal)
            const rbpn = rbp.cross(normal)
            const JDenomRot = rapn.mult(rapn).mult(objectA.invMoi)
                .add(rbpn.mult(rbpn).mult(objectB.invMoi))
                .add(JDenom)
            J = Vec.divide(JNum, JDenomRot)
            if (objectA.torque) {
                objectA.torque = objectA.torque.sub(rap.cross(normal.mult(J)).divide(dt))
            }
            if (objectB.torque) {
                objectB.torque = objectB.torque.add(rbp.cross(normal.mult(J)).divide(dt))
            }
        } else {
            let j = JNum / JDenom
            J = new Vec(j, j, j)
        }
        // standard impulse
        if (objectA.force) {
            velA = velA.add(normal.mult(J).mult(objectA.invMass))
            objectA.force = objectA.force.sub(normal.mult(J as Vec).divide(dt))
        }
        if (objectB.force) {
            velB = velB.add(normal.mult(J).mult(objectB.invMass))
            objectB.force = objectB.force.add(normal.mult(J as Vec).divide(dt))
        }

        // @TODO: implement friction impulse
        
    }
}