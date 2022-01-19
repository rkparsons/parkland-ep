import { Mesh, Vector3 } from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import { MutableRefObject } from 'react'

export type WaypointControllerProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    waypoint: MutableRefObject<Mesh | undefined>
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
    isInitialised: boolean
}

export type ModelProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    getIsRotatingLeft(): boolean
    getIsRotatingRight(): boolean
    getSpeed(): number
}

export type Path = {
    start: Vector3
    direction: Vector3
    end: Vector3
}
