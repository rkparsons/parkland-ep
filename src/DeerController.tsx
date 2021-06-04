import {
    AbstractMesh,
    GroundMesh,
    Matrix,
    Mesh,
    PickingInfo,
    Quaternion,
    Ray,
    Space,
    Tools,
    Vector3
} from '@babylonjs/core'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import React, { FC, Suspense, useEffect, useRef } from 'react'

import Ground from './Ground'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// import useAnimationLinked from './useAnimationLinked'
// import useAnimationOneShot from './useAnimationOneShot'

const DeerController: FC = () => {
    const translationSpeed = 0.05
    const rotationSpeed = 0.02
    const scene = useScene()
    const distVecRef = useRef<number>(0)
    const angleRef = useRef<number>(0)
    const targetVecNormRef = useRef<Vector3>(Vector3.Zero())
    const groundRef = useRef<GroundMesh>()
    const waypointRef = useRef<Mesh>()
    const deerRef = useRef<AbstractMesh>()
    const quaternationRef = useRef<Quaternion>(Quaternion.Identity())
    const walk = useAnimation('Walk_forward_IP', () => distVecRef.current >= 10 * translationSpeed)
    // todo: add other idle anims on loop
    const idle = useAnimation('Idle_1', () => distVecRef.current < 10 * translationSpeed)
    const left = useAnimationBlended(
        'Rotate_left_IP',
        () => distVecRef.current >= translationSpeed && angleRef.current < -50 * rotationSpeed
    )
    const right = useAnimationBlended(
        'Rotate_Right_IP',
        () => distVecRef.current >= translationSpeed && angleRef.current > 50 * rotationSpeed
    )
    // const jump = useAnimationOneShot(' ', 'Jump')

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        if (
            !groundRef.current ||
            !deerRef.current ||
            !waypointRef.current ||
            !deerRef.current.rotationQuaternion
        ) {
            return
        }

        angleRef.current = getAngleBetweenMeshes(deerRef.current, waypointRef.current)

        console.log(angleRef.current < 0 ? 'left' : 'right')
        const isWalking = distVecRef.current >= translationSpeed
        const isRotating = isWalking && Math.abs(angleRef.current) >= rotationSpeed
        const isSlowWalk = angleRef.current >= 1

        walk.render()
        idle.render()
        left.render()
        right.render()
        // jump.render()

        if (isRotating) {
            quaternationRef.current.copyFrom(deerRef.current.rotationQuaternion)

            deerRef.current.lookAt(waypointRef.current.position)

            Quaternion.SlerpToRef(
                quaternationRef.current,
                deerRef.current.rotationQuaternion,
                rotationSpeed,
                deerRef.current.rotationQuaternion
            )
        }

        if (isWalking) {
            const walkSpeed = isSlowWalk ? translationSpeed / 4 : translationSpeed
            distVecRef.current -= walkSpeed
            deerRef.current.translate(targetVecNormRef.current, walkSpeed, Space.WORLD)

            deerRef.current.moveWithCollisions(Vector3.Zero())

            // Casting a ray to get height
            let ray = new Ray(
                new Vector3(
                    deerRef.current.position.x,
                    groundRef.current.getBoundingInfo().boundingBox.maximumWorld.y + 1,
                    deerRef.current.position.z
                ),
                new Vector3(0, 0, 0)
            )
            const worldInverse = new Matrix()
            groundRef.current.getWorldMatrix().invertToRef(worldInverse)
            ray = Ray.Transform(ray, worldInverse)
            const pickInfo = groundRef.current.intersects(ray)
            if (pickInfo.hit && pickInfo.pickedPoint) {
                deerRef.current.position.y = pickInfo.pickedPoint.y + 1
            }
        }
    })

    // todo: move to utils
    const getAngleBetweenMeshes = (mesh1: AbstractMesh, mesh2: AbstractMesh) => {
        const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
        const v1 = mesh2.position.subtract(mesh1.position).normalize()
        const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

        return direction * Math.acos(Vector3.Dot(v0, v1))
    }

    const onPointerDown = (e: PointerEvent, pickResult: PickingInfo) => {
        if (
            e.button === 0 &&
            pickResult.hit &&
            pickResult.pickedPoint &&
            pickResult.pickedMesh === groundRef.current &&
            waypointRef.current &&
            deerRef.current
        ) {
            let targetVec = pickResult.pickedPoint
            waypointRef.current.position = targetVec?.clone()
            const initVec = deerRef.current.position?.clone()
            distVecRef.current = Vector3.Distance(targetVec, initVec)
            targetVec = targetVec.subtract(initVec)
            targetVecNormRef.current = Vector3.Normalize(targetVec)
        }
    }

    const onModelLoaded = (model: ILoadedModel) => {
        deerRef.current = model.rootMesh
        model.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        // todo: move init logic to hooks
        walk.init()
        idle.init()
        left.init()
        right.init()
        // jump.init()
    }

    return (
        <>
            <Suspense fallback={null}>
                <Model
                    name="deer"
                    position={Vector3.Zero()}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="deer.glb"
                    scaleToDimension={3}
                    rotation={new Vector3(0, Tools.ToRadians(240), 0)}
                    onModelLoaded={onModelLoaded}
                    checkCollisions={true}
                    rotationQuaternion={Quaternion.Identity()}
                />
            </Suspense>
            <sphere name="waypoint" ref={waypointRef} isVisible={false} />
            <Ground groundRef={groundRef} />
        </>
    )
}

export default DeerController
