import { AbstractMesh, Angle, Matrix, Mesh, Quaternion, Ray, Space, Vector3 } from '@babylonjs/core'

export function getAngleBetweenMeshes(mesh1: AbstractMesh, mesh2: AbstractMesh) {
    const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
    const v1 = mesh2.position.subtract(mesh1.position).normalize()
    const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

    return Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
}

export function rotateCharacterTowardsWaypoint(
    character: AbstractMesh,
    waypoint: AbstractMesh,
    factor: number
) {
    if (!character.rotationQuaternion) {
        return
    }

    const quaternation = character.rotationQuaternion.clone()

    character.lookAt(waypoint.position)

    Quaternion.SlerpToRef(
        quaternation,
        character.rotationQuaternion,
        factor,
        character.rotationQuaternion
    )
}

export function translateCharacterTowardsWaypoint(
    character: AbstractMesh,
    ground: AbstractMesh,
    waypoint: AbstractMesh,
    speedFactor: number,
    maxSpeed: number
) {
    if (speedFactor === 0) {
        return
    }

    const normal = Vector3.Normalize(waypoint.position.subtract(character.position))
    const walkSpeed = speedFactor * maxSpeed

    character.translate(normal, walkSpeed, Space.WORLD)
    character.moveWithCollisions(Vector3.Zero())
    // translateCharacterAboveGround(character, ground)
}

export function translateCharacterAboveGround(character: AbstractMesh, ground: AbstractMesh) {
    const origin = character.position
    const up = Vector3.Normalize(origin)
    const down = up.negate()
    const rayDown = new Ray(origin, down, 0.2)
    const isAboveGround = ground.intersects(rayDown).hit

    if (isAboveGround) {
        character.translate(down, 0.1, Space.LOCAL)
    } else {
        character.translate(up, 1, Space.LOCAL)
    }
}
