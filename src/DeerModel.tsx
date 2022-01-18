import { FC, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { PhysicsImpostor, Quaternion, Tools, Vector3 } from '@babylonjs/core'

import { ModelProps } from './types'
import useAnimation from './useAnimation'
import useCameraContext from './useCameraContext'

// todo: replace with getSpeed methods for left, right and straight
const DeerModel: FC<ModelProps> = ({ model, getIsRotatingLeft, getIsRotatingRight, getSpeed }) => {
    const scene = useScene()
    const { setLockedTarget } = useCameraContext()
    const idle = useAnimation('Idle')
    const walk = useAnimation('WalkForward')
    const left = useAnimation('TurnLeft')
    const right = useAnimation('TurnRight')

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

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

        // if (model.current && model.current.rootMesh) {
        //     const contactLocalRefPoint = Vector3.Zero()
        //     const contactPoint = model.current.rootMesh.absolutePosition.add(contactLocalRefPoint)
        //     const position = model.current.rootMesh.position
        //     model.current.rootMesh
        //         .getPhysicsImpostor()
        //         ?.applyForce(new Vector3(-position.x, -position.y, -position.z), contactPoint)
        // }
    })

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={new Vector3(0, 260.5, 0)}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                sceneFilename="Deer.glb"
                scaleToDimension={3}
                rotation={new Vector3(0, Tools.ToRadians(240), 0)}
                onModelLoaded={onModelLoaded}
                checkCollisions={true}
                rotationQuaternion={Quaternion.Identity()}
            >
                <physicsImpostor
                    type={PhysicsImpostor.SphereImpostor}
                    object={model.current?.rootMesh}
                    _options={{
                        mass: 1,
                        friction: 1,
                        restitution: 0.7
                    }}
                />
            </Model>
        </Suspense>
    )
}

export default DeerModel
