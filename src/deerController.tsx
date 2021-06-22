import { FC, useEffect, useRef } from 'react'
import { GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { rotateCharacter, translateCharacter } from './utils'

import DeerModel from './DeerModel'
import Ground from './Ground'
import { getAngleBetweenMeshes } from './utils'

const DeerController: FC = () => {
    const model = useRef<ILoadedModel>()
    const ground = useRef<GroundMesh>()
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
            <Ground ground={ground} />
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

export default DeerController
