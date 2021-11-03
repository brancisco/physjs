import Vec from '@/Math/Vec3'
import Quaternion from '@/Math/Quaternion'
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

function testPlaneVSphere (planeCol: PlaneCollider, sphereCol: SphereCollider, dim: 1 | 2 | 3): Collision<ColliderObject> | undefined {
    let collision = undefined
    const plane = planeCol.object
    const sphere = sphereCol.object

    const pa = (new Quaternion(0, [plane.scale.x/2, 0, 0])).mult(plane.rot)
    let zscale = plane.scale.z/2
    if (dim === 2) {
        zscale = 1
    }
    const pb = (new Quaternion(0, [0, plane.scale.y/2, zscale])).mult(plane.rot)
    const planeNormal = pa.v.cross(pb.v).normal()
    let dist = Vec.dot(Vec.sub(plane.pos, sphere.pos), planeNormal)
    const sign = Math.sign(dist)
    if (Math.abs(dist) < sphere.scale[0]) {
        // the planes deepest point
        const a = sphere.pos.add(planeNormal.mult(dist))
        // the spheres deepest point
        const b = sphere.pos.add(planeNormal.mult(-1*sphere.scale[0]))
        collision = {
            objectA: plane,
            objectB: sphere,
            a,
            b,
            depth: a.sub(b).mag(),
            normal: planeNormal,
        }

    }
    return collision
}

export class Collider {
    object: any;
    dim: 1 | 2 | 3

    constructor (object: any) {
        this.object = object
        this.dim = 3
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
            collision = testSphereVSphere(this, collider)
        } else if (collider instanceof PlaneCollider) {
            collision = testPlaneVSphere(collider, this, this.dim)
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
            collision = testPlaneVSphere(this, collider, this.dim)
        } else if (collider instanceof PlaneCollider) {
            // console.log('PlaneCollider::test -',this.constructor.name)
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
