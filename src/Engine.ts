import { ColliderObject, SolidBodyObject } from './Object'
import Vec from '@/Math/Vec3'
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
        if (!dt) return;
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
        this.boundVelocity = [new Vec(200, 200, 0)]
        this.objects = []
        this.solvers = []
    }

    step (dt: number) {
        if (!dt) return;
        for (const object of this.objects) {
            if (object instanceof SolidBodyObject && !object.isSleeping()) {
                this.updateObject(object, dt)
            }
        }
    }

    updateObject (object: SolidBodyObject, dt: number) {
        const initVel = object.vel
        object.force = Vec.add(object.force, Vec.mult(this.gravity, object.mass))
        // console.log(object.force)
        // console.log(Vec.mult(Vec.divide(object.force, object.mass), dt))
        object.vel = Vec.add(object.vel, Vec.mult(Vec.divide(object.force, object.mass), dt))
        // console.log(object.vel)
        object.vel = Vec.bound(object.vel, ...this.boundVelocity)
        object.pos = Vec.add(object.pos, Vec.mult(object.vel, dt))
        object.force = new Vec()
    }
}