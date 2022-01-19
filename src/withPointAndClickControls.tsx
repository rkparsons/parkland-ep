import { FC, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Ray, Vector3 } from '@babylonjs/core'

import { WaypointControllerProps } from './types'
import { getAngleBetweenMeshes } from './utils'
import useWorldContext from './useWorldContext'

type SubWaypointProps = {
    index: number
    subWaypoints: MutableRefObject<Mesh[]>
    pathOrigin: Vector3
    pathEnd: Vector3
}

const SubWaypoint: FC<SubWaypointProps> = ({ index, subWaypoints, pathOrigin, pathEnd }) => {
    useEffect(() => {
        subWaypoints.current[index].position = pathOrigin.add(
            pathEnd.subtract(pathOrigin).scale(++index / subWaypoints.current.length)
        )
    }, [pathOrigin, pathEnd])

    return (
        <sphere
            name={`waypoint_${index}`}
            ref={(el) => (subWaypoints.current[index] = el as Mesh)}
            position={Vector3.Zero()}
        />
    )
}

const withPointAndClickControls = (WaypointController: FC<WaypointControllerProps>) => {
    const modelWithPointAndClickControls: FC = () => {
        const { world } = useWorldContext()
        const [isInitialised, setIsInitialised] = useState(false)
        const model = useRef<ILoadedModel>()
        const scene = useScene()
        const waypoint = useRef<Mesh>()
        const subWaypoints = useRef<Mesh[]>([])
        const [pathOrigin, setPathOrigin] = useState<Vector3>(Vector3.Zero())
        const [pathEnd, setPathEnd] = useState<Vector3>(Vector3.Zero())
        const debug = useRef<Mesh>()
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

        // function setDebug() {
        //     if (!model.current?.rootMesh || !world.current || !debug.current || !scene) {
        //         return
        //     }

        //     const origin = model.current.rootMesh.position
        //     const down = Vector3.Normalize(origin.negate())
        //     const rayDown = new Ray(origin, down)
        //     const pickingInfo = scene.pickWithRay(rayDown)

        //     if (pickingInfo && pickingInfo.hit && pickingInfo.pickedMesh === world.current) {
        //         debug.current.position = pickingInfo.pickedPoint!.clone()
        //     }
        // }

        function onPointerDown(e: PointerEvent, intersection: PickingInfo) {
            const isMouseDownHit =
                e.button === 0 && intersection.hit && intersection.pickedPoint && waypoint.current

            if (!isMouseDownHit) {
                return
            }

            setIsInitialised(true)
            setWaypoint(intersection)

            if (!waypoint.current || !model.current?.rootMesh) {
                return
            }

            setPathOrigin(model.current.rootMesh.position)
            setPathEnd(waypoint.current.position)
        }

        return (
            <>
                <sphere
                    name="waypoint"
                    ref={waypoint}
                    isPickable={false}
                    position={new Vector3(0, 260.5, 0)}
                />
                {Array.from(Array(10).keys()).map((index) => (
                    <SubWaypoint
                        key={index}
                        index={index}
                        subWaypoints={subWaypoints}
                        pathOrigin={pathOrigin}
                        pathEnd={pathEnd}
                    />
                ))}

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
