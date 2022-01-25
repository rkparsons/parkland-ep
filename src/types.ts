import { AbstractMesh, Mesh, Vector3 } from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import { MutableRefObject } from 'react'

export type WaypointControllerProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    waypointTarget: MutableRefObject<AbstractMesh | undefined>
    subWaypoints: MutableRefObject<Mesh[]>
    activeSubWaypointIndex: number
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
    isInitialised: boolean
}

export type ModelProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    waypointTarget: MutableRefObject<AbstractMesh | undefined>
    getIsRotatingLeft(): boolean
    getIsRotatingRight(): boolean
    getSpeed(): number
}

export type Path = {
    start: Vector3
    direction: Vector3
    end: Vector3
}
