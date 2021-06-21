import { AbstractMesh, Angle, Quaternion, Vector3 } from '@babylonjs/core'

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
