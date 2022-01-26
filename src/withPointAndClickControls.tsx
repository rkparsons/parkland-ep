import { AbstractMesh, Bone, Mesh, PickingInfo, Ray, Vector3 } from '@babylonjs/core'
import { FC, Suspense, useEffect, useRef, useState } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
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
        const headBone = useRef<Bone>()
        const subWaypoints = useRef<Mesh[]>([])
        const subWaypointCount = 20
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
                const ray = new Ray(clickOrigin, Vector3.Down())
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

        return (
            <>
                <Waypoint
                    character={model}
                    waypoint={waypoint}
                    headBone={headBone}
                    distanceToWaypoint={distanceToWaypoint}
                />
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
                    headBone={headBone}
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
