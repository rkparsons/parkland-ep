import { Angle, GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { getAngleBetweenMeshes, rotateCharacter, translateCharacter } from './utils'
import { useEffect, useRef } from 'react'

import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

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

    const onPointerDown = (e: PointerEvent, intersection: PickingInfo) => {
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

    const initControls = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

        model.current.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        walkAnimation.init()
        leftAnimation.init()
        rightAnimation.init()
    }

    // todo: always use degrees to reduce function calls
    const getWalkspeedFactor = (distanceToWaypoint: number, angleToWaypoint: Angle) => {
        const degrees = angleToWaypoint.degrees()
        const distanceFactor =
            distanceToWaypoint < 2 ? 0.5 : distanceToWaypoint < 4 ? distanceToWaypoint / 4 : 1
        const angleFactor =
            degrees < 15 || degrees > 345 ? 1 : degrees < 90 || degrees > 270 ? 0.2 : 0

        return distanceFactor * angleFactor
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

        const angleToWaypoint = getAngleBetweenMeshes(model.current.rootMesh, waypoint.current)
        const distanceToWaypoint = Vector3.Distance(
            waypoint.current.position,
            model.current.rootMesh.position
        )

        const isRotatingLeft =
            distanceToWaypoint > 1 &&
            angleToWaypoint.degrees() > 180 &&
            angleToWaypoint.degrees() < 330

        const isRotatingRight =
            distanceToWaypoint > 1 &&
            angleToWaypoint.degrees() < 180 &&
            angleToWaypoint.degrees() > 30

        const walkSpeedFactor = getWalkspeedFactor(distanceToWaypoint, angleToWaypoint)
        const isWalking = walkSpeedFactor > 0
        const isRotating = distanceToWaypoint >= 1 && Math.abs(angleToWaypoint.degrees()) >= 5

        if (isRotating) {
            rotateCharacter(model.current.rootMesh, waypoint.current, 0.02)
        }

        if (isWalking) {
            translateCharacter(
                model.current.rootMesh,
                waypoint.current,
                ground.current,
                walkSpeedFactor,
                0.05
            )
        }

        walkAnimation.render(walkSpeedFactor)
        leftAnimation.render(isRotatingLeft)
        rightAnimation.render(isRotatingRight)
    })

    return {
        waypoint,
        ground,
        initControls
    }
}

export default usePointAndClickControls
