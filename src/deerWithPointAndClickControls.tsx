import { FC, useEffect, useRef } from 'react'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { rotateCharacter, translateCharacter } from './utils'

import DeerModel from './DeerModel'
import { getAngleBetweenMeshes } from './utils'
import useGroundContext from './useGroundContext'

const DeerWithPointAndClickControls: FC = () => {
    const { ground } = useGroundContext()
    const model = useRef<ILoadedModel>()
    const scene = useScene()
    const waypoint = useRef<Mesh>()
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

    function rotate(factor: number) {
        if (!model.current?.rootMesh || !waypoint.current) {
            return
        }

        rotateCharacter(model.current?.rootMesh, waypoint.current, factor)
    }

    function translate(maxSpeed: number, characterSpeed: number) {
        if (!model.current?.rootMesh || !waypoint.current || !ground.current) {
            return
        }
        translateCharacter(
            model.current.rootMesh,
            waypoint.current,
            ground.current,
            characterSpeed,
            maxSpeed
        )
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
    })

    return (
        <>
            <sphere name="waypoint" ref={waypoint} isVisible={false} />
            <DeerModel
                model={model}
                distanceToWaypoint={distanceToWaypoint}
                degreesToWaypoint={degreesToWaypoint}
                rotate={rotate}
                translate={translate}
            />
        </>
    )
}

export default DeerWithPointAndClickControls
