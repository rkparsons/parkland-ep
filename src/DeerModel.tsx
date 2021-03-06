import { FC, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { Quaternion, Tools, Vector3 } from '@babylonjs/core'

import { ModelProps } from './types'
import useAnimation from './useAnimation'
import useCameraContext from './useCameraContext'
import useWorldContext from './useWorldContext'

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
                position={new Vector3(-89.36748591807384, 80.94085858364929, -96.29647778307779)}
                rootUrl={`${process.env.PUBLIC_URL}/models/`}
                sceneFilename="Deer.glb"
                scaleToDimension={3}
                onModelLoaded={onModelLoaded}
                rotationQuaternion={Quaternion.Identity()}
                checkCollisions={false}
            />
        </Suspense>
    )
}

export default DeerModel
