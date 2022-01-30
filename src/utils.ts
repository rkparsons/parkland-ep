import {
    AbstractMesh,
    ActionManager,
    Angle,
    ArcRotateCamera,
    DirectionalLight,
    Engine,
    ExecuteCodeAction,
    Matrix,
    Mesh,
    Quaternion,
    Ray,
    Scene,
    SceneLoader,
    ShadowGenerator,
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

export function renderScene() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement // Get the canvas element
    const engine = new Engine(canvas, true, { disableWebGL2Support: true }) // Generate the BABYLON 3D engine
    const scene = new Scene(engine)
    const camera = new ArcRotateCamera('Scene0a Camera', 1.8, 1.4, 10.4, Vector3.Zero(), scene)
    camera.attachControl(canvas, true)

    const light = new DirectionalLight('Dir', new Vector3(0, -0.5, -1.0), scene)
    light.position = new Vector3(0, 200, 6)
    light.direction = Vector3.Down()
    light.intensity = 0.7

    const shadowGenerator = new ShadowGenerator(2048, light)
    shadowGenerator.useBlurExponentialShadowMap = true
    shadowGenerator.blurKernel = 32
    shadowGenerator.darkness = 0.2

    SceneLoader.ImportMesh(
        '',
        'https://dl.dropbox.com/s/5k48146islxdkts/',
        'DeerInPlaceMotionNewBone.glb',
        scene,
        function (meshes, particleSystems, skeletons, animationGroups) {
            meshes[0].receiveShadows = true
            meshes[0].rotation = new Vector3(0, 1, 0)
            //shadows
            for (let i = 0; i < meshes.length; i++) {
                shadowGenerator.getShadowMap()!.renderList!.push(meshes[i])
            }
        }
    )

    SceneLoader.ImportMesh(
        '',
        'https://dl.dropbox.com/s/0sz41w3gfe1j93b/',
        'Mailer_Planet4.glb',
        scene,
        function (newMeshes, particleSystems, skeletons, animationGroups) {
            newMeshes[0].position = new Vector3(0, -100, 0)
            newMeshes[0].scaling = new Vector3(10, 10, 10)
            const ground = newMeshes.find((x) => x.name === 'Planet Top')!

            ground.receiveShadows = true
        }
    )

    console.log(scene)

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render()
    })

    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () {
        engine.resize()
    })
}
