import { Color3, PBRMaterial, Vector3 } from '@babylonjs/core'
import { FC, MutableRefObject, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'

type ViewProps = {
    waypoint: MutableRefObject<ILoadedModel | undefined>
    distanceToWaypoint: MutableRefObject<number>
}

const Waypoint: FC<ViewProps> = ({ waypoint, distanceToWaypoint }) => {
    useBeforeRender(() => {
        if (!waypoint.current?.rootMesh) {
            return
        }

        waypoint.current.rootMesh.rotation.y += 0.02
    })

    function onModelLoaded(loadedModel: ILoadedModel) {
        waypoint.current = loadedModel
    }

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={new Vector3(0, 260.5, 0)}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                onModelLoaded={onModelLoaded}
                sceneFilename="Waypoint.glb"
                scaleToDimension={1.5}
                isPickable={false}
            />
        </Suspense>
    )
}

export default Waypoint
