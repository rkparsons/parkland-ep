import { FC, useEffect, useRef, useState } from 'react'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Vector3 } from '@babylonjs/core'

import { WaypointControllerProps } from './types'
import { getAngleBetweenMeshes } from './utils'
import useGroundContext from './useGroundContext'

const withPointAndClickControls = (WaypointController: FC<WaypointControllerProps>) => {
    const modelWithPointAndClickControls = () => {
        const { ground } = useGroundContext()
        const [isInitialised, setIsInitialised] = useState(false)
        const model = useRef<ILoadedModel>()
        const scene = useScene()
        const waypoint = useRef<Mesh>()
        const distanceToWaypoint = useRef(0)
        const degreesToWaypoint = useRef(0)

        useEffect(() => {
            if (scene) {
                scene.onPointerDown = onPointerDown
            }
        }, [scene])

        useBeforeRender(() => {
            if (!model.current?.rootMesh || !waypoint.current) {
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

        function setWaypoint(intersection: PickingInfo) {
            const isGroundIntersection = intersection.pickedMesh === ground.current
            const clickPosition = intersection.pickedPoint!.clone()

            if (isGroundIntersection) {
                waypoint.current!.position = clickPosition
            } else {
                clickPosition._y = 0
                waypoint.current!.position = clickPosition
            }
        }

        function onPointerDown(e: PointerEvent, intersection: PickingInfo) {
            const isMouseDownHit =
                e.button === 0 && intersection.hit && intersection.pickedPoint && waypoint.current

            if (isMouseDownHit) {
                setIsInitialised(true)
                setWaypoint(intersection)
            }
        }

        return (
            <>
                <sphere name="waypoint" ref={waypoint} isVisible={false} />
                <WaypointController
                    model={model}
                    waypoint={waypoint}
                    distanceToWaypoint={distanceToWaypoint}
                    degreesToWaypoint={degreesToWaypoint}
                    isInitialised={isInitialised}
                />
            </>
        )
    }

    return modelWithPointAndClickControls
}

export default withPointAndClickControls
