import { ColliderObject, SolidBodyObject } from './Object'
import Vec from './Vec'
import { Solver } from './Solver'
import Collision from './Collision'

class CollisionEngine {
    objects: ColliderObject[]
    solvers: Solver[]
    constructor () {
        this.objects = []
        this.solvers = []
    }

    addObject (object: ColliderObject) {
        this.objects.push(object)
    }

    addSolver (solver: Solver) {
        this.solvers.push(solver)
    }

    handleCollisions (dt: number) {
        const collisions: Collision<ColliderObject>[] = []
        for (const a of this.objects) {
            for (const b of this.objects) {
                if (a == b) break;
                if (!a.collider || !b.collider) continue;
                const collision = a.collider.test(b.collider)
                if (collision) {
                    collisions.push(collision)
                }
            }
        }
        for (const solver of this.solvers) {
            for (const collision of collisions) {
                solver.solve(collision, dt)
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
        this.boundVelocity = [new Vec(120, 120, 0)]
        this.objects = []
        this.solvers = []
    }

    step (dt: number) {
        for (const object of this.objects) {
            this.updateObject(object, dt)
        }
    }

    updateObject (object: SolidBodyObject, dt: number) {
        const initVel = object.vel
        object.vel = Vec.add(object.vel, Vec.mult(Vec.add(object.acc, this.gravity), dt))
        object.vel = Vec.bound(object.vel, ...this.boundVelocity)
        object.pos = Vec.add(object.pos, Vec.mult(Vec.divide(Vec.add(initVel, object.vel), 2), dt))
    }
}