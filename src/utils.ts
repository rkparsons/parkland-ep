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
    translateCharacterAboveGround(character, ground)
}

export function translateCharacterAboveGround(character: AbstractMesh, ground: AbstractMesh) {
    const { x, y, z } = character.position
    // const up = Vector3.Normalize(new Vector3(x, y, z))
    const down = Vector3.Down()
    const rayDown = new Ray(character.position, down, 0.1)
    const isAboveGround = ground.intersects(rayDown).hit

    character.translate(down, isAboveGround ? 0.1 : -0.1, Space.LOCAL)

    console.log('isAboveGround', isAboveGround)
}
