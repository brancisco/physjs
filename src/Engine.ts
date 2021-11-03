import { ColliderObject, SolidBodyObject } from './Object'
import Vec from '@/Math/Vec3'
import { Solver, PositionCorrectionSolver } from './Solver'
import Collision from './Collision'

class CollisionEngine {
    objects: ColliderObject[]
    solvers: Solver[]
    dim: 1 | 2 | 3
    solveStrength: number
    constructor () {
        this.objects = []
        this.solvers = []
        this.dim = 3
        this.solveStrength = 5
    }

    addObject (object: ColliderObject) {
        object.collider.dim = this.dim
        this.objects.push(object)
    }

    addSolver (solver: Solver) {
        this.solvers.push(solver)
    }

    handleCollisions (dt: number) {
        if (!dt) return;
        for (let i = 0; i < this.solveStrength; i ++) {
            const collisions: Collision<ColliderObject>[] = []
            for (const a of this.objects) {
                for (const b of this.objects) {
                    if (a == b) break;
                    if (!a.collider || !b.collider) continue;
                    const collision = a.collider.test(b.collider)
                    if (collision) {
                        if (a instanceof SolidBodyObject) {
                            a.wake()
                        }
                        if (b instanceof SolidBodyObject) {
                            b.wake()
                        }
                        collisions.push(collision)
                    }
                }
            }
            for (const solver of this.solvers) {
                if (i !== 0 && !(solver instanceof PositionCorrectionSolver)) continue
                for (const collision of collisions) {
                    solver.solve(collision, dt)
                }
            }
        }
    }
}

export default class Engine extends CollisionEngine {
    objects: SolidBodyObject[]
    gravity: Vec;
    boundVelocity: [Vec];

    constructor (gravity?: Vec) {
        super()
        this.gravity = gravity || new Vec(0, 9.8, 0) // 9.8 is real value
        this.boundVelocity = [new Vec(200, 200, 0)]
        this.objects = []
        this.solvers = []
    }

    step (dt: number) {
        if (!dt) return;
        for (const object of this.objects) {
            if (object instanceof SolidBodyObject) {
                if (!object.isSleeping()) {
                    this.updateObject(object, dt)
                } else {
                    object.decrementSleepTime(dt)
                }
            }
        }
    }

    updateObject (object: SolidBodyObject, dt: number) {
        const initVel = object.vel

        object.force = Vec.add(object.force, Vec.mult(this.gravity, object.mass))
        if (!object.isSleeping() && object.force.mag() < object.sleepThreshold) {
            // NOTE: Sleep system doesn't do all that much
            // need to work on all this
            object.addSleepTime(dt*5)
        }

        object.vel = Vec.add(object.vel, Vec.mult(Vec.divide(object.force, object.mass), dt))
        object.vel = Vec.bound(object.vel, ...this.boundVelocity)
        object.pos = Vec.add(object.pos, Vec.mult(object.vel, dt))
        object.force = new Vec()
    }
}