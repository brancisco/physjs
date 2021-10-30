import Vec from './Vec'
import Collision from './Collision'
import { ColliderObject, SolidBodyObject } from './Object'


export class Collider {
    object: any;

    constructor (object: any) {
        this.object = object
    }

    test (collider: SphereCollider):Collision<ColliderObject> 
    test (collider: PlaneCollider):Collision<ColliderObject>

    test (collider: Collider): Collision<ColliderObject> {
        if (collider instanceof SphereCollider) {
            console.log(this.constructor.name)
        } else if (collider instanceof PlaneCollider) {
            console.log(this.constructor.name)
        } else if (collider instanceof Collider) {
            console.log(this.constructor.name)
        } else {
            console.log('Collider::test - WTF')
        }
        return {
            objectA: this.object,
            objectB: collider.object,
            a: new Vec(),
            b: new Vec(),
            depth: 0,
            normal: new Vec(),
        }
    }

    onCollision (collision: Collision<ColliderObject>) {

    }

}

export class SphereCollider extends Collider {
    constructor (object: any) {
        super(object)
    }
    test (collider: Collider): Collision<ColliderObject> | undefined {
        if (collider instanceof SphereCollider) {
            const diff = Vec.sub(collider.object.pos, this.object.pos)
            const dist = diff.mag()
            if (dist < this.object.r + collider.object.r) {
                const normal = diff.normal()
                const a = Vec.add(this.object.pos, Vec.mult(normal, this.object.r))
                const b = Vec.sub(collider.object.pos, Vec.mult(normal, collider.object.r))
                const collision = {
                    objectA: this.object,
                    objectB: collider.object,
                    a,
                    b,
                    depth: Vec.sub(a, b).mag(),
                    normal,
                }
                this.onCollision(collision)
                return collision
            }
        } else if (collider instanceof PlaneCollider) {
            console.log(this.constructor.name)
        } else if (collider instanceof Collider) {
            console.log(this.constructor.name)
        } else {
            console.log('Collider::test - WTF')
        }
        return undefined;
    }
}

export class PlaneCollider extends Collider {
    constructor (object: any) {
        super(object)
    }

    test (collider: Collider): Collision<ColliderObject> | undefined {
        if (collider instanceof SphereCollider) {
            console.log(this.constructor.name)
        } else if (collider instanceof PlaneCollider) {
            console.log(this.constructor.name)
        } else if (collider instanceof Collider) {
            console.log(this.constructor.name)
        } else {
            console.log('Collider::test - WTF')
        }
        return undefined;
    }
}
