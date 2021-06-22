import { FC, MutableRefObject, useEffect, useRef } from 'react'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Vector3 } from '@babylonjs/core'

import { getAngleBetweenMeshes } from './utils'
import useGroundContext from './useGroundContext'

type ModelProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    waypoint: MutableRefObject<Mesh | undefined>
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
}

const withPointAndClickControls = (Model: FC<ModelProps>) => {
    const modelWithPointAndClickControls = () => {
        const { ground } = useGroundContext()
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

        return (
            <>
                <sphere name="waypoint" ref={waypoint} isVisible={false} />
                <Model
                    model={model}
                    waypoint={waypoint}
                    distanceToWaypoint={distanceToWaypoint}
                    degreesToWaypoint={degreesToWaypoint}
                />
            </>
        )
    }

    return modelWithPointAndClickControls
}

export default withPointAndClickControls
