import { FC, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { Quaternion, Tools, Vector3 } from '@babylonjs/core'

import { ModelProps } from './types'
import useAnimation from './useAnimation'
import useCameraContext from './useCameraContext'

// todo: replace with getSpeed methods for left, right and straight
const DeerModel: FC<ModelProps> = ({
    model,
    waypointTarget,
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

        waypointTarget.current = loadedModel.meshes?.find((x) => x.name === 'WaypointTarget')
        waypointTarget.current!.isVisible = false

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
        walk.render(walkSpeed, !isRotating)
        left.render(1, isRotatingLeft)
        right.render(1, isRotatingRight)
    })

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={new Vector3(1.259455715172333, 91.77743093636705, 69.43811731453933)}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                sceneFilename="Deer.glb"
                scaleToDimension={3}
                rotation={new Vector3(0, Tools.ToRadians(240), 0)}
                onModelLoaded={onModelLoaded}
                checkCollisions={true}
                rotationQuaternion={Quaternion.Identity()}
            />
        </Suspense>
    )
}

export default DeerModel
