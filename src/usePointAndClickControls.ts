import { AbstractMesh, GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { getAngleBetweenMeshes, rotateCharacter, translateCharacter } from './utils'
import { useEffect, useRef } from 'react'

import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// todo: separate translation/rotation from animation
// todo: pass generic array of actions which take all possible waypoint props
function usePointAndClickControls() {
    const model = useRef<ILoadedModel>()
    const ground = useRef<GroundMesh>()
    const waypoint = useRef<Mesh>()

    const scene = useScene()

    // todo: use identical animation functions
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    function onPointerDown(e: PointerEvent, intersection: PickingInfo) {
        if (
            e.button === 0 &&
            intersection.hit &&
            intersection.pickedPoint &&
            intersection.pickedMesh === ground.current &&
            waypoint.current
        ) {
            waypoint.current.position = intersection.pickedPoint.clone()
        }
    }

    function initControls(loadedModel: ILoadedModel) {
        model.current = loadedModel

        model.current.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        walkAnimation.init()
        leftAnimation.init()
        rightAnimation.init()
    }

    function getWalkspeedFactor(distanceToWaypoint: number, degreesToWaypoint: number) {
        const distanceFactor =
            distanceToWaypoint < 2 ? 0.5 : distanceToWaypoint < 4 ? distanceToWaypoint / 4 : 1
        const angleFactor =
            degreesToWaypoint < 15 || degreesToWaypoint > 345
                ? 1
                : degreesToWaypoint < 90 || degreesToWaypoint > 270
                ? 0.2
                : 0

        return distanceFactor * angleFactor
    }

    function rotateTowardsWaypoint(
        character: AbstractMesh,
        waypoint: AbstractMesh,
        distanceToWaypoint: number,
        degreesToWaypoint: number
    ) {
        const isRotatingLeft =
            distanceToWaypoint > 1 && degreesToWaypoint > 180 && degreesToWaypoint < 330

        const isRotatingRight =
            distanceToWaypoint > 1 && degreesToWaypoint < 180 && degreesToWaypoint > 30

        const isRotating = distanceToWaypoint >= 1

        if (isRotating) {
            rotateCharacter(character, waypoint, 0.02)
        }

        leftAnimation.render(isRotatingLeft)
        rightAnimation.render(isRotatingRight)
    }

    function walkTowardsWaypoint(
        character: AbstractMesh,
        ground: AbstractMesh,
        waypoint: AbstractMesh,
        distanceToWaypoint: number,
        degreesToWaypoint: number
    ) {
        const walkSpeedFactor = getWalkspeedFactor(distanceToWaypoint, degreesToWaypoint)
        const isWalking = walkSpeedFactor > 0

        if (isWalking) {
            translateCharacter(character, waypoint, ground, walkSpeedFactor, 0.05)
        }

        walkAnimation.render(walkSpeedFactor)
    }

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        if (!model.current?.rootMesh || !waypoint.current || !ground.current) {
            return
        }

        const degreesToWaypoint = getAngleBetweenMeshes(
            model.current.rootMesh,
            waypoint.current
        ).degrees()

        const distanceToWaypoint = Vector3.Distance(
            waypoint.current.position,
            model.current.rootMesh.position
        )

        rotateTowardsWaypoint(
            model.current.rootMesh,
            waypoint.current,
            distanceToWaypoint,
            degreesToWaypoint
        )

        walkTowardsWaypoint(
            model.current.rootMesh,
            ground.current,
            waypoint.current,
            distanceToWaypoint,
            degreesToWaypoint
        )
    })

    return {
        waypoint,
        ground,
        initControls
    }
}

export default usePointAndClickControls
