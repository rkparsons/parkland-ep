import { GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import {
    getAngleBetweenMeshes,
    getCharacterSpeed,
    rotateCharacter,
    translateCharacter
} from './utils'
import { useEffect, useRef } from 'react'

// todo: separate translation/rotation from animation
// todo: pass generic array of actions which take all possible waypoint props
function usePointAndClickControls() {
    const model = useRef<ILoadedModel>()
    const ground = useRef<GroundMesh>()
    const waypoint = useRef<Mesh>()
    const scene = useScene()
    const distanceToWaypoint = useRef(0)
    const degreesToWaypoint = useRef(0)

    function onPointerDown(e: PointerEvent, intersection: PickingInfo) {
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

    useEffect(() => {
        if (scene) {
            scene.onPointerDown = onPointerDown
        }
    }, [scene])

    useBeforeRender(() => {
        if (!model.current?.rootMesh || !waypoint.current || !ground.current) {
            return
        }

        degreesToWaypoint.current = getAngleBetweenMeshes(
            model.current.rootMesh,
            waypoint.current
        ).degrees()

        distanceToWaypoint.current = Vector3.Distance(
            waypoint.current.position,
            model.current.rootMesh.position
        )

        if (distanceToWaypoint.current >= 1) {
            rotateCharacter(model.current.rootMesh, waypoint.current, 0.02)
        }

        const characterSpeed = getCharacterSpeed(
            distanceToWaypoint.current,
            degreesToWaypoint.current
        )

        translateCharacter(
            model.current.rootMesh,
            waypoint.current,
            ground.current,
            characterSpeed,
            0.05
        )
    })

    return {
        model,
        waypoint,
        ground,
        distanceToWaypoint,
        degreesToWaypoint
    }
}

export default usePointAndClickControls
