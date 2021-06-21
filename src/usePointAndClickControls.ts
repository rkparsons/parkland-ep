import { Angle, GroundMesh, Matrix, Mesh, PickingInfo, Ray, Space, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { getAngleBetweenMeshes, rotateCharacter } from './utils'
import { useEffect, useRef } from 'react'

import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// todo: pass generic array of actions which take all possible waypoint props
function usePointAndClickControls() {
    const maxWalkSpeed = 0.05

    const model = useRef<ILoadedModel>()
    const ground = useRef<GroundMesh>()
    const waypoint = useRef<Mesh>()

    const scene = useScene()

    // todo: use identical animation functions
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    const onPointerDown = (e: PointerEvent, pickResult: PickingInfo) => {
        if (
            e.button === 0 &&
            pickResult.hit &&
            pickResult.pickedPoint &&
            pickResult.pickedMesh === ground.current &&
            waypoint.current
        ) {
            waypoint.current.position = pickResult.pickedPoint.clone()
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

    // todo: put translate/rotate into utils
    const translateRoot = (speedFactor: number) => {
        if (!ground.current || !model.current || !model.current.rootMesh || !waypoint.current) {
            return
        }

        const normal = Vector3.Normalize(
            waypoint.current.position.subtract(model.current.rootMesh.position)
        )

        const walkSpeed = speedFactor * maxWalkSpeed
        model.current.rootMesh.translate(normal, walkSpeed, Space.WORLD)

        model.current.rootMesh.moveWithCollisions(Vector3.Zero())

        // Casting a ray to get height
        let ray = new Ray(
            new Vector3(
                model.current.rootMesh.position.x,
                ground.current.getBoundingInfo().boundingBox.maximumWorld.y + 1,
                model.current.rootMesh.position.z
            ),
            new Vector3(0, 0, 0)
        )
        const worldInverse = new Matrix()
        ground.current.getWorldMatrix().invertToRef(worldInverse)
        ray = Ray.Transform(ray, worldInverse)
        const pickInfo = ground.current.intersects(ray)
        if (pickInfo.hit && pickInfo.pickedPoint) {
            model.current.rootMesh.position.y = pickInfo.pickedPoint.y + 1
        }
    }

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        if (!model.current?.rootMesh || !waypoint.current) {
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
            rotateCharacter(model.current, waypoint.current, 0.02)
        }

        if (isWalking) {
            translateRoot(walkSpeedFactor)
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
