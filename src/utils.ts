import {
    AbstractMesh,
    ActionManager,
    Angle,
    ExecuteCodeAction,
    Matrix,
    Mesh,
    Quaternion,
    Ray,
    Sound,
    Space,
    Vector3
} from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import { MutableRefObject } from 'react'
import { SpatialSound } from './types'

export function getAngleBetweenMeshes(mesh1: AbstractMesh, mesh2: AbstractMesh) {
    const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
    const v1 = mesh2.position.subtract(mesh1.position).normalize()
    const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

    return Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
}

export function rotateCharacterTowardsPoint(
    character: AbstractMesh,
    position: Vector3,
    factor: number
) {
    if (!character.rotationQuaternion) {
        return
    }

    const quaternation = character.rotationQuaternion.clone()

    character.lookAt(position)

    Quaternion.SlerpToRef(
        quaternation,
        character.rotationQuaternion,
        factor,
        character.rotationQuaternion
    )
}

export function translateCharacterTowardsPoint(
    character: AbstractMesh,
    position: Vector3,
    speedFactor: number,
    maxSpeed: number
) {
    if (speedFactor === 0) {
        return
    }

    const normal = Vector3.Normalize(position.subtract(character.position))
    const walkSpeed = speedFactor * maxSpeed

    character.translate(normal, walkSpeed, Space.WORLD)
    character.moveWithCollisions(Vector3.Zero())
}

export function cursorPointerOnHover(mesh: AbstractMesh) {
    mesh.actionManager = new ActionManager(mesh._scene)
    mesh.actionManager.registerAction(
        new ExecuteCodeAction(
            ActionManager.OnPointerOverTrigger,
            () => (mesh._scene.hoverCursor = 'pointer')
        )
    )
}

export function getModelObjects(worldModel: ILoadedModel, typeName: string) {
    return worldModel.meshes?.filter(({ name }) => name.startsWith(typeName)) || []
}

export function attachSoundToMesh(
    mesh: AbstractMesh,
    spatialSound: SpatialSound,
    audioLoops: MutableRefObject<Sound[]>
) {
    const { url, maxDistance, volume } = spatialSound
    const soundName = url.split('/').slice(-1)[0]
    const sound = new Sound(soundName, spatialSound.url, mesh._scene, null, {
        loop: true,
        autoplay: false,
        maxDistance,
        volume
    })
    sound.switchPanningModelToHRTF()
    sound.attachToMesh(mesh)

    audioLoops.current.push(sound)
}

export function attachTextToMesh(mesh: AbstractMesh, text: string) {
    mesh.metadata.text = text
}
