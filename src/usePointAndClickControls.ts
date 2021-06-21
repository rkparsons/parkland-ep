import { Angle, GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { useEffect, useRef } from 'react'

import useTurnAction from './useTurnAction'
import useWalkAction from './useWalkAction'

// todo: pass generic array of actions which take all possible waypoint props
function usePointAndClickControls() {
    const model = useRef<ILoadedModel>()
    const angle = useRef<Angle>(Angle.FromRadians(0))
    const ground = useRef<GroundMesh>()
    const waypoint = useRef<Mesh>()
    const distVec = useRef<number>(0)
    const targetVecNorm = useRef<Vector3>(Vector3.Zero())
    const scene = useScene()
    const walk = useWalkAction(angle, distVec, model, ground, targetVecNorm)
    const turn = useTurnAction(angle, distVec, model, waypoint)

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
            distVec.current = Vector3.Distance(targetVec, initVec)
            targetVec = targetVec.subtract(initVec)
            targetVecNorm.current = Vector3.Normalize(targetVec)
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
        waypoint,
        ground,
        initControls
    }
}

export default usePointAndClickControls
