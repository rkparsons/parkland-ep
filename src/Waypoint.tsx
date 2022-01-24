import { FC, MutableRefObject, Suspense, useEffect, useRef, useState } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { Mesh, PickingInfo, Ray, Vector3 } from '@babylonjs/core'
import { Path, WaypointControllerProps } from './types'

import SubWaypoint from './SubWaypoint'
import { getAngleBetweenMeshes } from './utils'
import useCameraContext from './useCameraContext'
import useWorldContext from './useWorldContext'

type ViewProps = {
    waypoint: MutableRefObject<Mesh | undefined>
}

const Waypoint: FC<ViewProps> = ({ waypoint }) => {
    const waypointModel = useRef<ILoadedModel>()

    useBeforeRender(() => {
        if (!waypointModel.current) {
            return
        }
    })

    function onModelLoaded(loadedModel: ILoadedModel) {
        waypointModel.current = loadedModel
    }

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={waypoint.current?.position}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                onModelLoaded={onModelLoaded}
                sceneFilename="Waypoint.glb"
                scaleToDimension={3}
            />
        </Suspense>
    )
}

export default Waypoint
