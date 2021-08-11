import { Mesh, Vector3 } from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import { MutableRefObject } from 'react'

export type WaypointControllerProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    waypoint: MutableRefObject<Mesh | undefined>
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
}

export type ModelProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    getIsRotatingLeft(): boolean
    getIsRotatingRight(): boolean
    getSpeed(): number
}

export type Feature = {
    position: Vector3
    soundURL: string
}
