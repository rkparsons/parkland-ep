import {
    AbstractMesh,
    GroundMesh,
    Mesh,
    PickingInfo,
    Quaternion,
    Tools,
    Vector3
} from '@babylonjs/core'
import { FC, Suspense, useEffect, useRef } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'

import Ground from './Ground'
import useTurnAction from './useTurnAction'
import useWalkAction from './useWalkAction'

const DeerController: FC = () => {
    const scene = useScene()
    const distVecRef = useRef<number>(0)
    const angleRef = useRef<number>(0)
    const targetVecNormRef = useRef<Vector3>(Vector3.Zero())
    const groundRef = useRef<GroundMesh>()
    const waypointRef = useRef<Mesh>()
    const deerRef = useRef<AbstractMesh>()
    const walk = useWalkAction(0.05, angleRef, distVecRef, deerRef, groundRef, targetVecNormRef)
    const turn = useTurnAction(0.02, 0.05, angleRef, distVecRef, deerRef, waypointRef)
    // todo: add other idle anims on loop
    // const idle = useAnimationLinked('Idle_1', () => 1 - walk.speedRef.current)

    // const jump = useAnimationOneShot(' ', 'Jump')

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        walk.render()
        // idle.render()
        turn.render()
        // jump.render()
    })

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

        walk.init()
        turn.init()
        // idle.init()
        // jump.init()
    }

    return (
        <>
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
            <sphere name="waypoint" ref={waypointRef} isVisible={false} />
            <Ground groundRef={groundRef} />
        </>
    )
}

export default DeerController
