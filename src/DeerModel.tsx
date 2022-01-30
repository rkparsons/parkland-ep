import { DirectionalLight, Quaternion, ShadowGenerator, Tools, Vector3 } from '@babylonjs/core'
import { FC, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'

import { ModelProps } from './types'
import useAnimation from './useAnimation'
import useCameraContext from './useCameraContext'

// todo: replace with getSpeed methods for left, right and straight
const DeerModel: FC<ModelProps> = ({
    model,
    headBone,
    getIsRotatingLeft,
    getIsRotatingRight,
    getSpeed
}) => {
    const scene = useScene()
    const { setLockedTarget } = useCameraContext()
    const idle = useAnimation('Idle')
    const walk = useAnimation('WalkForward')
    const left = useAnimation('TurnLeft')
    const right = useAnimation('TurnRight')

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

        headBone.current = model.current.skeletons![0].bones.find((x) => x.name === 'Waypoint')
        scene!.audioListenerPositionProvider = () => model.current!.rootMesh!.absolutePosition
        scene!.audioPositioningRefreshRate = 100
        scene!.headphone = true

        loadedModel.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        idle.init()
        walk.init()
        left.init()
        right.init()

        scene!.audioListenerPositionProvider = () => model.current!.rootMesh!.absolutePosition
        setLockedTarget(loadedModel.rootMesh!)

        const light = new DirectionalLight('Dir', Vector3.Down(), scene!)
        light.position = new Vector3(89.21744186810362, 85.00960779873975, 97.87237428264427)
        light.intensity = 0.7

        const shadowGenerator = new ShadowGenerator(2048, light)
        shadowGenerator.useBlurExponentialShadowMap = true
        shadowGenerator.blurKernel = 32
        shadowGenerator.darkness = 0.2

        const meshes = model.current.meshes!
        meshes[0].receiveShadows = true
        //shadows
        for (let i = 0; i < meshes.length; i++) {
            shadowGenerator.getShadowMap()!.renderList!.push(meshes[i])
        }
    }

    useBeforeRender(() => {
        const walkSpeed = getSpeed()
        const isRotatingLeft = getIsRotatingLeft()
        const isRotatingRight = getIsRotatingRight()
        const isRotating = isRotatingLeft || isRotatingRight
        const isWalking = walkSpeed > 0

        idle.render(1, !isWalking && !isRotating)
        walk.render(walkSpeed, isWalking && !isRotating)
        left.render(1, isRotatingLeft)
        right.render(1, isRotatingRight)
    })

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={new Vector3(89.21744186810362, 81.00960779873975, 97.87237428264427)}
                rootUrl={`${process.env.PUBLIC_URL}/models/`}
                sceneFilename="Deer.glb"
                scaleToDimension={3}
                rotation={new Vector3(0, Tools.ToRadians(180), 0)}
                onModelLoaded={onModelLoaded}
                rotationQuaternion={Quaternion.Identity()}
                checkCollisions={false}
            />
        </Suspense>
    )
}

export default DeerModel
