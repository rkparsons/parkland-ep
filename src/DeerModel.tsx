import { FC, MutableRefObject, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs'
import { Mesh, Quaternion, Tools, Vector3 } from '@babylonjs/core'
import { getCharacterSpeed, rotateCharacter, translateCharacter } from './utils'

import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'
import useGroundContext from './useGroundContext'

type ViewProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    waypoint: MutableRefObject<Mesh | undefined>
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
}

const DeerModel: FC<ViewProps> = ({ model, waypoint, distanceToWaypoint, degreesToWaypoint }) => {
    const { ground } = useGroundContext()
    // todo: use identical animation functions
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    function rotate(factor: number) {
        if (!model.current?.rootMesh || !waypoint.current) {
            return
        }

        rotateCharacter(model.current?.rootMesh, waypoint.current, factor)
    }

    function translate(maxSpeed: number, characterSpeed: number) {
        if (!model.current?.rootMesh || !waypoint.current || !ground.current) {
            return
        }
        translateCharacter(
            model.current.rootMesh,
            waypoint.current,
            ground.current,
            characterSpeed,
            maxSpeed
        )
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
