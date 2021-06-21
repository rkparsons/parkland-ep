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
    const distance = useRef<number>(0)
    const normal = useRef<Vector3>(Vector3.Zero())
    const scene = useScene()

    const getIsTurningLeft = () =>
        distance.current > 1 && angle.current.degrees() > 180 && angle.current.degrees() < 330

    const getIsTurningRight = () =>
        distance.current > 1 && angle.current.degrees() < 180 && angle.current.degrees() > 30

    const walk = useWalkAction(angle, distance, model, ground, normal)
    const turn = useTurnAction(
        angle,
        distance,
        model,
        waypoint,
        getIsTurningLeft,
        getIsTurningRight
    )

    const updateAngle = () => {
        if (!model.current?.rootMesh || !waypoint.current) {
            return
        }

        const v0 = model.current.rootMesh.getDirection(new Vector3(0, 0, 1)).normalize()
        const v1 = waypoint.current.position.subtract(model.current.rootMesh.position).normalize()
        const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

        angle.current = Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
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

        walk.init()
        turn.init()
    }

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        updateAngle()

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
