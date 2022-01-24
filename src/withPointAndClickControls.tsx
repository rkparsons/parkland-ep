import { FC, Suspense, useEffect, useRef, useState } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Ray, Vector3 } from '@babylonjs/core'
import { Path, WaypointControllerProps } from './types'

import SubWaypoint from './SubWaypoint'
import Waypoint from './Waypoint'
import { getAngleBetweenMeshes } from './utils'
import useCameraContext from './useCameraContext'
import useWorldContext from './useWorldContext'

const withPointAndClickControls = (WaypointController: FC<WaypointControllerProps>) => {
    const modelWithPointAndClickControls: FC = () => {
        const { world } = useWorldContext()
        const [isInitialised, setIsInitialised] = useState(false)
        const model = useRef<ILoadedModel>()
        const scene = useScene()
        const waypoint = useRef<Mesh>()
        const waypointModel = useRef<ILoadedModel>()
        const subWaypoints = useRef<Mesh[]>([])
        const subWaypointCount = 10
        const [activeSubWaypointIndex, setActiveSubWaypointIndex] = useState(0)
        const [path, setPath] = useState<Path>()
        const distanceToWaypoint = useRef(0)
        const degreesToActiveSubWaypoint = useRef(0)
        const { followWithCamera } = useCameraContext()

        useEffect(() => {
            if (scene) {
                scene.onPointerDown = onPointerDown
            }
        }, [scene])

        useBeforeRender(() => {
            if (!model.current?.rootMesh || !waypoint.current || !subWaypoints.current.length) {
                return
            }

            const activeSubWaypoint = subWaypoints.current[activeSubWaypointIndex]

            degreesToActiveSubWaypoint.current = getAngleBetweenMeshes(
                model.current.rootMesh,
                activeSubWaypoint
            ).degrees()

            const distanceToActiveSubWaypoint = Vector3.Distance(
                model.current.rootMesh.position,
                activeSubWaypoint.position
            )

            distanceToWaypoint.current = Vector3.Distance(
                waypoint.current.position,
                model.current.rootMesh.position
            )

            followWithCamera(model.current.rootMesh.position, distanceToWaypoint.current)

            if (distanceToActiveSubWaypoint < 1 && activeSubWaypointIndex < subWaypointCount - 1) {
                setActiveSubWaypointIndex(activeSubWaypointIndex + 1)
            }
        })

        function setWaypoint(intersection: PickingInfo) {
            const isGroundIntersection = intersection.pickedMesh === world.current

            if (isGroundIntersection) {
                waypoint.current!.position = intersection.pickedPoint!.clone()
            } else {
                const clickOrigin = intersection.pickedMesh!.position
                const down = clickOrigin.negate()
                const ray = new Ray(clickOrigin, down)
                const pickingInfo = world.current?.intersects(ray)

                if (pickingInfo?.pickedPoint) {
                    waypoint.current!.position = pickingInfo.pickedPoint.clone()
                }
            }
        }

        function onPointerDown(e: PointerEvent, intersection: PickingInfo) {
            const isMouseDownHit =
                e.button === 0 && intersection.hit && intersection.pickedPoint && waypoint.current

            if (!isMouseDownHit) {
                return
            }

            setIsInitialised(true)
            setWaypoint(intersection)

            setActiveSubWaypointIndex(0)

            if (!waypoint.current || !model.current?.rootMesh) {
                return
            }

            setPath({
                start: model.current.rootMesh.position,
                direction: waypoint.current.position.subtract(model.current.rootMesh.position),
                end: waypoint.current.position
            })
        }

        function onModelLoaded(loadedModel: ILoadedModel) {
            waypointModel.current = loadedModel
        }

        return (
            <>
                <sphere
                    name="waypoint"
                    ref={waypoint}
                    isPickable={false}
                    position={new Vector3(0, 260.5, 0)}
                    visibility={0}
                />
                <Waypoint waypoint={waypoint} />
                {path &&
                    Array.from(Array(subWaypointCount).keys()).map((index) => (
                        <SubWaypoint
                            key={index}
                            index={index}
                            isActive={index === activeSubWaypointIndex}
                            subWaypoints={subWaypoints}
                            path={path}
                        />
                    ))}

                <WaypointController
                    model={model}
                    subWaypoints={subWaypoints}
                    activeSubWaypointIndex={activeSubWaypointIndex}
                    distanceToWaypoint={distanceToWaypoint}
                    degreesToWaypoint={degreesToActiveSubWaypoint}
                    isInitialised={isInitialised}
                />
            </>
        )
    }

    return modelWithPointAndClickControls
}

export default withPointAndClickControls
