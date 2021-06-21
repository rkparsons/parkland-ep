import {
    Angle,
    GroundMesh,
    Matrix,
    Mesh,
    PickingInfo,
    Quaternion,
    Ray,
    Space,
    Vector3
} from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { useEffect, useRef } from 'react'

import { getAngleBetweenMeshes } from './utils'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// todo: pass generic array of actions which take all possible waypoint props
function usePointAndClickControls() {
    const model = useRef<ILoadedModel>()
    const ground = useRef<GroundMesh>()
    const waypoint = useRef<Mesh>()
    const distance = useRef<number>(0)
    const normal = useRef<Vector3>(Vector3.Zero())
    const scene = useScene()
    const rotationSpeed = 0.02
    const maxSpeed = 0.05
    const quaternationRef = useRef<Quaternion>(Quaternion.Identity())
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    const onPointerDown = (e: PointerEvent, pickResult: PickingInfo) => {
        if (
            e.button === 0 &&
            pickResult.hit &&
            pickResult.pickedPoint &&
            pickResult.pickedMesh === ground.current &&
            waypoint.current &&
            model.current &&
            model.current.rootMesh
        ) {
            let targetVec = pickResult.pickedPoint
            waypoint.current.position = targetVec?.clone()
            const initVec = model.current.rootMesh.position?.clone()
            distance.current = Vector3.Distance(targetVec, initVec)
            targetVec = targetVec.subtract(initVec)
            normal.current = Vector3.Normalize(targetVec)
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
    const getWalkspeedFactor = (angleToWaypoint: Angle) => {
        const degrees = angleToWaypoint.degrees()
        const distanceFactor =
            distance.current < 2 ? 0.5 : distance.current < 4 ? distance.current / 4 : 1
        const angleFactor =
            degrees < 15 || degrees > 345 ? 1 : degrees < 90 || degrees > 270 ? 0.2 : 0

        return distanceFactor * angleFactor
    }

    // todo: put translate/rotate into utils
    const translateRoot = (speedFactor: number) => {
        if (!ground.current || !model.current || !model.current.rootMesh) {
            return
        }

        const walkSpeed = speedFactor * maxSpeed
        distance.current -= walkSpeed
        model.current.rootMesh.translate(normal.current, walkSpeed, Space.WORLD)

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

    const rotateRoot = () => {
        if (!model.current || !waypoint.current || !model.current.rootMesh?.rotationQuaternion) {
            return
        }

        quaternationRef.current.copyFrom(model.current.rootMesh.rotationQuaternion)

        model.current.rootMesh.lookAt(waypoint.current.position)

        Quaternion.SlerpToRef(
            quaternationRef.current,
            model.current.rootMesh.rotationQuaternion,
            rotationSpeed,
            model.current.rootMesh.rotationQuaternion
        )
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

        const isRotatingLeft =
            distance.current > 1 &&
            angleToWaypoint.degrees() > 180 &&
            angleToWaypoint.degrees() < 330

        const isRotatingRight =
            distance.current > 1 &&
            angleToWaypoint.degrees() < 180 &&
            angleToWaypoint.degrees() > 30

        const walkSpeedFactor = getWalkspeedFactor(angleToWaypoint)
        const isWalking = walkSpeedFactor > 0
        const isRotating = distance.current >= 1 && Math.abs(angleToWaypoint.degrees()) >= 5

        if (isRotating) {
            rotateRoot()
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
