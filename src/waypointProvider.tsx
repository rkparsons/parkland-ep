import { FC, MutableRefObject, ReactNode, useEffect, useRef } from 'react'
import { GroundMesh, Mesh, PickingInfo, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { getAngleBetweenMeshes, getCharacterSpeed } from './utils'
import { rotateCharacter, translateCharacter } from './utils'

import WaypointContext from './waypointContext'

type ViewProps = {
    children: ReactNode
    model: MutableRefObject<ILoadedModel | undefined>
    ground: MutableRefObject<GroundMesh | undefined>
}

const WaypointProvider: FC<ViewProps> = ({ children, model, ground }) => {
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

        const characterSpeed = getCharacterSpeed(
            distanceToWaypoint.current,
            degreesToWaypoint.current
        )

        if (distanceToWaypoint.current >= 1) {
            rotateCharacter(model.current.rootMesh, waypoint.current, 0.02)
        }

        translateCharacter(
            model.current.rootMesh,
            waypoint.current,
            ground.current,
            characterSpeed,
            0.05
        )
    })

    return (
        <WaypointContext.Provider value={{ distanceToWaypoint, degreesToWaypoint }}>
            {children}
            <sphere name="waypoint" ref={waypoint} isVisible={false} />
        </WaypointContext.Provider>
    )
}

export default WaypointProvider
