import { FC, MutableRefObject, Suspense, useEffect, useRef, useState } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Ray, Vector3 } from '@babylonjs/core'
import { Path, WaypointControllerProps } from './types'

import SubWaypoint from './SubWaypoint'
import { getAngleBetweenMeshes } from './utils'
import useCameraContext from './useCameraContext'
import useWorldContext from './useWorldContext'

type ViewProps = {
    waypoint: MutableRefObject<ILoadedModel | undefined>
}

const Waypoint: FC<ViewProps> = ({ waypoint }) => {
    useBeforeRender(() => {
        if (!waypoint.current?.rootMesh) {
            return
        }

        waypoint.current.rootMesh.rotation.y += 0.01
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
                scaleToDimension={3}
                isPickable={false}
            />
        </Suspense>
    )
}

export default Waypoint
