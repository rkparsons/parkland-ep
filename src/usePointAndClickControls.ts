import { GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { MutableRefObject, useEffect, useRef } from 'react'

import useTurnAction from './useTurnAction'
import useWalkAction from './useWalkAction'

function usePointAndClickControls(groundRef: MutableRefObject<GroundMesh | undefined>) {
    const model = useRef<ILoadedModel>()
    const angleRef = useRef<number>(0)
    const waypointRef = useRef<Mesh>()
    const distVecRef = useRef<number>(0)
    const targetVecNormRef = useRef<Vector3>(Vector3.Zero())
    const scene = useScene()
    const walk = useWalkAction(0.05, angleRef, distVecRef, model, groundRef, targetVecNormRef)
    const turn = useTurnAction(0.02, 0.05, angleRef, distVecRef, model, waypointRef)

    const onPointerDown = (e: PointerEvent, pickResult: PickingInfo) => {
        if (
            e.button === 0 &&
            pickResult.hit &&
            pickResult.pickedPoint &&
            pickResult.pickedMesh === groundRef.current &&
            waypointRef.current &&
            model.current &&
            model.current.rootMesh
        ) {
            let targetVec = pickResult.pickedPoint
            waypointRef.current.position = targetVec?.clone()
            const initVec = model.current.rootMesh.position?.clone()
            distVecRef.current = Vector3.Distance(targetVec, initVec)
            targetVec = targetVec.subtract(initVec)
            targetVecNormRef.current = Vector3.Normalize(targetVec)
        }
    }

    const initControls = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

        model.current.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        walk.init()
        turn.init()
    }

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        walk.render()
        turn.render()
    })

    return {
        waypointRef,
        initControls
    }
}

export default usePointAndClickControls
