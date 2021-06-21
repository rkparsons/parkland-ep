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

import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// todo: pass generic array of actions which take all possible waypoint props
function usePointAndClickControls() {
    const model = useRef<ILoadedModel>()
    const angle = useRef<Angle>(Angle.FromRadians(0))
    const ground = useRef<GroundMesh>()
    const waypoint = useRef<Mesh>()
    const distance = useRef<number>(0)
    const normal = useRef<Vector3>(Vector3.Zero())
    const scene = useScene()
    const rotationSpeed = 0.02
    const maxSpeed = 0.05
    const speedRef = useRef(0)
    const quaternationRef = useRef<Quaternion>(Quaternion.Identity())
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    const updateAngle = () => {
        if (!model.current?.rootMesh || !waypoint.current) {
            return
        }

        const v0 = model.current.rootMesh.getDirection(new Vector3(0, 0, 1)).normalize()
        const v1 = waypoint.current.position.subtract(model.current.rootMesh.position).normalize()
        const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

        angle.current = Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
    }

    const rotateRoot = () => {
        if (!model.current || !waypoint.current || !model.current.rootMesh?.rotationQuaternion) {
            return
        }

        const isRotating = distance.current >= 1 && Math.abs(angle.current.degrees()) >= 5

        if (isRotating) {
            quaternationRef.current.copyFrom(model.current.rootMesh.rotationQuaternion)

            model.current.rootMesh.lookAt(waypoint.current.position)

            Quaternion.SlerpToRef(
                quaternationRef.current,
                model.current.rootMesh.rotationQuaternion,
                rotationSpeed,
                model.current.rootMesh.rotationQuaternion
            )
        }
    }

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

    const getAngleFactor = () => {
        const degrees = angle.current.degrees()

        if (degrees < 15 || degrees > 345) {
            return 1
        } else if (degrees < 90 || degrees > 270) {
            return 0.2
        } else {
            return 0
        }
    }

    const getDistanceFactor = () => {
        return distance.current < 2 ? 0.5 : distance.current < 4 ? distance.current / 4 : 1
    }

    const translateRoot = () => {
        if (!ground.current || !model.current || !model.current.rootMesh) {
            return
        }

        speedRef.current = getDistanceFactor() * getAngleFactor()

        if (speedRef.current > 0) {
            const walkSpeed = speedRef.current * maxSpeed
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
    }

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        updateAngle()
        rotateRoot()
        translateRoot()

        const isTurningLeft =
            distance.current > 1 && angle.current.degrees() > 180 && angle.current.degrees() < 330

        const isTurningRight =
            distance.current > 1 && angle.current.degrees() < 180 && angle.current.degrees() > 30

        const walkSpeed = getDistanceFactor() * getAngleFactor()

        walkAnimation.render(walkSpeed)
        leftAnimation.render(isTurningLeft)
        rightAnimation.render(isTurningRight)
    })

    return {
        waypoint,
        ground,
        initControls
    }
}

export default usePointAndClickControls
