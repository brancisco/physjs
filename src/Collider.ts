import Vec from '@/Math/Vec3'
import Collision from './Collision'
import { ColliderObject, SolidBodyObject } from './Object'


function testSphereVSphere (sphereCol1: SphereCollider, sphereCol2: SphereCollider): Collision<ColliderObject> | undefined {
    let collision = undefined
    const sphere1 = sphereCol1.object
    const sphere2 = sphereCol2.object
    const diff = sphere1.pos.sub(sphere2.pos)
    const dist = diff.mag()
    if (dist < sphere2.scale[0] + sphere1.scale[0]) {
        const normal = diff.normal()
        const a = sphere2.pos.add(Vec.mult(normal, sphere2.scale[0]))
        const b = sphere1.pos.sub(Vec.mult(normal, sphere1.scale[0]))
        collision = {
            objectA: sphere2,
            objectB: sphere1,
            a,
            b,
            depth: a.sub(b).mag(),
            normal,
        }
    }
    return collision
}

function testBoxVSphere (box: BoxCollider, sphere: SphereCollider): Collision<ColliderObject> | undefined {
    let collision = undefined
    return collision
}

function testBoxVBox (box1: BoxCollider, box2: BoxCollider): Collision<ColliderObject> | undefined {
    let collision = undefined
    return collision
}

function testPlaneVSphere (planeCol: PlaneCollider, sphereCol: SphereCollider): Collision<ColliderObject> | undefined {
    let collision = undefined
    const plane = planeCol.object
    const sphere = sphereCol.object
    // temp plane normal until we figure out calculations for quaternions
    const planeNormal = new Vec(0, 1, 0).normal()
    const dist = Math.abs(Vec.dot(Vec.sub(plane.pos, sphere.pos), planeNormal))
    if (dist < sphere.scale[0]) {
        const a = sphere.pos.add(planeNormal.mult(dist))
        const b = sphere.pos.add(planeNormal.mult(sphere.scale[0]))
        const diff = a.sub(b)
        collision = {
            objectA: plane,
            objectB: sphere,
            a,
            b,
            depth: diff.mag(),
            normal: diff.normal(),
        }
    }
    return collision
}

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
        let collision = undefined
        if (collider instanceof SphereCollider) {
            return testSphereVSphere(this, collider)
        } else if (collider instanceof PlaneCollider) {
            return testPlaneVSphere(collider, this)
        } else if (collider instanceof Collider) {
            console.log('SphereCollider::test -', collider.constructor.name)
        } else {
            console.log('SphereCollider::test - WTF')
        }

        if (collision) {
            this.onCollision(collision)
            collider.object.collider.onCollision(collision)
        }
        return collision
    }
}

export class BoxCollider extends Collider {
    constructor (object: any) {
        super(object)
    }
}

export class PlaneCollider extends Collider {
    constructor (object: any) {
        super(object)
    }

    test (collider: Collider): Collision<ColliderObject> | undefined {
        let collision = undefined

        if (collider instanceof SphereCollider) {
            return testPlaneVSphere(this, collider)
        } else if (collider instanceof PlaneCollider) {
            console.log('PlaneCollider::test -',this.constructor.name)
        } else if (collider instanceof Collider) {
            console.log('PlaneCollider::test -',this.constructor.name)
        } else {
            console.log('Collider::test - WTF')
        }
        if (collision) {
            this.onCollision(collision)
            collider.object.collider.onCollision(collision)
        }
        return collision;
    }
}
