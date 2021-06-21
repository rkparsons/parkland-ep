import { AbstractMesh, Angle, Matrix, Quaternion, Ray, Space, Vector3 } from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'

export const getAngleBetweenMeshes = (mesh1: AbstractMesh, mesh2: AbstractMesh) => {
    const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
    const v1 = mesh2.position.subtract(mesh1.position).normalize()
    const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

    return Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
}

export const rotateCharacter = (
    character: ILoadedModel,
    waypoint: AbstractMesh,
    factor: number
) => {
    if (!character.rootMesh || !character.rootMesh.rotationQuaternion) {
        return
    }

    const quaternation = character.rootMesh.rotationQuaternion.clone()

    character.rootMesh.lookAt(waypoint.position)

    Quaternion.SlerpToRef(
        quaternation,
        character.rootMesh.rotationQuaternion,
        factor,
        character.rootMesh.rotationQuaternion
    )
}

export const translateCharacter = (
    character: ILoadedModel,
    waypoint: AbstractMesh,
    ground: AbstractMesh,
    speedFactor: number,
    maxSpeed: number
) => {
    if (!character.rootMesh) {
        return
    }

    const normal = Vector3.Normalize(waypoint.position.subtract(character.rootMesh.position))
    const walkSpeed = speedFactor * maxSpeed

    character.rootMesh.translate(normal, walkSpeed, Space.WORLD)
    character.rootMesh.moveWithCollisions(Vector3.Zero())

    // todo: refactor into separate method: Casting a ray to get height
    let ray = new Ray(
        new Vector3(
            character.rootMesh.position.x,
            ground.getBoundingInfo().boundingBox.maximumWorld.y + 1,
            character.rootMesh.position.z
        ),
        new Vector3(0, 0, 0)
    )
    const worldInverse = new Matrix()
    ground.getWorldMatrix().invertToRef(worldInverse)
    ray = Ray.Transform(ray, worldInverse)
    const pickInfo = ground.intersects(ray)
    if (pickInfo.hit && pickInfo.pickedPoint) {
        character.rootMesh.position.y = pickInfo.pickedPoint.y + 1
    }
}
