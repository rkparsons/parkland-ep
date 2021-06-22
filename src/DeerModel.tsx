import { FC, MutableRefObject, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs'
import { Quaternion, Tools, Vector3 } from '@babylonjs/core'

import { getCharacterSpeed } from './utils'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

type ViewProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
    rotate(factor: number): void
    translate(maxSpeed: number, characterSpeed: number): void
}

const DeerModel: FC<ViewProps> = ({
    model,
    distanceToWaypoint,
    degreesToWaypoint,
    rotate,
    translate
}) => {
    // todo: use identical animation functions
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    function inPlaceAnimation(characterSpeed: number) {
        const isRotatingLeft =
            distanceToWaypoint.current > 1 &&
            degreesToWaypoint.current > 180 &&
            degreesToWaypoint.current < 330

        const isRotatingRight =
            distanceToWaypoint.current > 1 &&
            degreesToWaypoint.current < 180 &&
            degreesToWaypoint.current > 30

        leftAnimation.render(isRotatingLeft)
        rightAnimation.render(isRotatingRight)
        walkAnimation.render(characterSpeed)
    }

    function rootMotion(characterSpeed: number) {
        if (!model.current?.rootMesh) {
            return
        }

        if (distanceToWaypoint.current >= 1) {
            rotate(0.02)
        }

        translate(0.05, characterSpeed)
    }

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

        loadedModel.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        walkAnimation.init()
        leftAnimation.init()
        rightAnimation.init()
    }

    useBeforeRender(() => {
        const characterSpeed = getCharacterSpeed(
            distanceToWaypoint.current,
            degreesToWaypoint.current
        )

        inPlaceAnimation(characterSpeed)
        rootMotion(characterSpeed)
    })

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={Vector3.Zero()}
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
