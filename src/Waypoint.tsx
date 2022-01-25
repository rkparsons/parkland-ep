import { AbstractMesh, Color3, Mesh, Vector3 } from '@babylonjs/core'
import { FC, MutableRefObject, Suspense, useRef } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'

type ViewProps = {
    character: MutableRefObject<ILoadedModel | undefined>
    waypoint: MutableRefObject<Mesh | undefined>
    waypointTarget: MutableRefObject<AbstractMesh | undefined>
    distanceToWaypoint: MutableRefObject<number>
}

const Waypoint: FC<ViewProps> = ({ character, waypoint, waypointTarget, distanceToWaypoint }) => {
    const waypointMarker = useRef<ILoadedModel>()

    useBeforeRender(() => {
        if (
            !waypointMarker.current?.rootMesh ||
            !character.current?.rootMesh ||
            !waypoint.current ||
            !waypointTarget.current
        ) {
            return
        }

        waypointMarker.current.rootMesh!.rotation.y += 0.02

        if (distanceToWaypoint.current < 2) {
            waypointMarker.current.rootMesh.position = Vector3.Lerp(
                waypointMarker.current.rootMesh.position,
                waypointTarget.current.absolutePosition.clone(),
                0.2
            )
        } else {
            waypointMarker.current.rootMesh.position = waypoint.current.position
        }
    })

    function onModelLoaded(loadedModel: ILoadedModel) {
        waypointMarker.current = loadedModel
    }

    return (
        <Suspense fallback={null}>
            <sphere
                name="waypoint"
                ref={waypoint}
                position={Vector3.Zero()}
                visibility={0}
                isPickable={false}
            >
                {/* <standardMaterial name="waypointMaterial" diffuseColor={Color3.Green()} /> */}
            </sphere>
            <Model
                name="waypointMarker"
                position={waypoint.current?.position}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                onModelLoaded={onModelLoaded}
                sceneFilename="Waypoint.glb"
                scaleToDimension={1.25}
                isPickable={false}
            />
        </Suspense>
    )
}

export default Waypoint
