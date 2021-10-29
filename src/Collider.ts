import Object from './Object'
import Vec from './Vec'
import Collision from './Collision'


export class Collider {
    object: any;

    constructor (object: any) {
        this.object = object
    }

    test (collider: SphereCollider):Collision 
    test (collider: PlaneCollider):Collision 

    test (collider: Collider): Collision {
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

}

export class SphereCollider extends Collider {
    constructor (object: any) {
        super(object)
    }
    test (collider: Collider): Collision | undefined {
        if (collider instanceof SphereCollider) {
            const diff = Vec.sub(collider.object.pos, this.object.pos)
            const dist = diff.mag()
            // console.log(dist)
            // console.log(this.object.r)
            if (dist < this.object.r + collider.object.r) {
                console.log('COLLISION')
                const normal = diff.normal()
                const a = Vec.add(this.object.pos, Vec.mult(normal, this.object.r))
                const b = Vec.sub(collider.object.pos, Vec.mult(normal, this.object.r))

                return {
                    objectA: this.object,
                    objectB: collider.object,
                    a,
                    b,
                    depth: Vec.sub(a, b).mag(),
                    normal,
                }
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

    test (collider: Collider): Collision | undefined {
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
