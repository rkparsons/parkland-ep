import { AbstractMesh, Bone, Color3, Mesh, Quaternion, Space, Vector3 } from '@babylonjs/core'
import { FC, MutableRefObject, Suspense, useRef } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'

type ViewProps = {
    character: MutableRefObject<ILoadedModel | undefined>
    waypoint: MutableRefObject<Mesh | undefined>
    headBone: MutableRefObject<Bone | undefined>
    distanceToWaypoint: MutableRefObject<number>
}

const Waypoint: FC<ViewProps> = ({ character, waypoint, headBone, distanceToWaypoint }) => {
    const waypointMarker = useRef<ILoadedModel>()

    useBeforeRender(() => {
        if (
            !waypointMarker.current?.rootMesh ||
            !character.current?.rootMesh ||
            !waypoint.current ||
            !headBone.current
        ) {
            return
        }

        waypointMarker.current.rootMesh!.rotation.y += 0.02

        if (distanceToWaypoint.current < 2) {
            waypointMarker.current.scaleTo(0.8)
            waypointMarker.current.rootMesh.position = headBone.current
                .getPosition(Space.WORLD, character.current?.rootMesh)
                .add(Vector3.Up().scale(0.2))
        } else {
            waypointMarker.current.rootMesh.position = waypoint.current.position.clone()
            waypointMarker.current.scaleTo(1)
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
