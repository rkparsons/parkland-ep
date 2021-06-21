import { AbstractMesh, Angle, Vector3 } from '@babylonjs/core'

export const getAngleBetweenMeshes = (mesh1: AbstractMesh, mesh2: AbstractMesh) => {
    const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
    const v1 = mesh2.position.subtract(mesh1.position).normalize()
    const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

    return Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
}
