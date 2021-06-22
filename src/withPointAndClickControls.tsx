import { FC, MutableRefObject, useEffect, useRef } from 'react'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { getAngleBetweenMeshes, rotateCharacter, translateCharacter } from './utils'

import useGroundContext from './useGroundContext'

type ModelProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
    rotate(factor: number): void
    translate(maxSpeed: number, characterSpeed: number): void
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

        return (
            <>
                <sphere name="waypoint" ref={waypoint} isVisible={false} />
                <Model
                    model={model}
                    distanceToWaypoint={distanceToWaypoint}
                    degreesToWaypoint={degreesToWaypoint}
                    rotate={rotate}
                    translate={translate}
                />
            </>
        )
    }

    return modelWithPointAndClickControls
}

export default withPointAndClickControls
