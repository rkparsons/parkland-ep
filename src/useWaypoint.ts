import { AbstractMesh, GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useEffect, useRef } from 'react'

import { useScene } from 'react-babylonjs'

function useWaypoint(
    groundRef: MutableRefObject<GroundMesh | undefined>,
    characterRef: MutableRefObject<AbstractMesh | undefined>
) {
    const waypointRef = useRef<Mesh>()
    const distVecRef = useRef<number>(0)
    const targetVecNormRef = useRef<Vector3>(Vector3.Zero())
    const scene = useScene()

    const onPointerDown = (e: PointerEvent, pickResult: PickingInfo) => {
        if (
            e.button === 0 &&
            pickResult.hit &&
            pickResult.pickedPoint &&
            pickResult.pickedMesh === groundRef.current &&
            waypointRef.current &&
            characterRef.current
        ) {
            let targetVec = pickResult.pickedPoint
            waypointRef.current.position = targetVec?.clone()
            const initVec = characterRef.current.position?.clone()
            distVecRef.current = Vector3.Distance(targetVec, initVec)
            targetVec = targetVec.subtract(initVec)
            targetVecNormRef.current = Vector3.Normalize(targetVec)
        }
    }

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    return {
        waypointRef,
        distVecRef,
        targetVecNormRef
    }
}

export default useWaypoint
