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
    waypoint: AbstractMesh,
    ground: AbstractMesh,
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
    const intersection = getCharacterGroundIntersection(character, ground)

    if (intersection.hit && intersection.pickedPoint) {
        character.position.y = intersection.pickedPoint.y + 1
    }
}

export function getCharacterGroundIntersection(character: AbstractMesh, ground: AbstractMesh) {
    let ray = new Ray(
        new Vector3(
            character.position.x,
            ground.getBoundingInfo().boundingBox.maximumWorld.y + 1,
            character.position.z
        ),
        new Vector3(0, 0, 0)
    )

    const worldInverse = new Matrix()
    ground.getWorldMatrix().invertToRef(worldInverse)
    ray = Ray.Transform(ray, worldInverse)
    return ground.intersects(ray)
}

export function vectorToLocal(vector: Vector3, mesh: AbstractMesh) {
    const worldMatrix = mesh.getWorldMatrix()

    return Vector3.TransformCoordinates(vector, worldMatrix)
}
