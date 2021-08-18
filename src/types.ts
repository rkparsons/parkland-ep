import { Mesh, Vector3 } from '@babylonjs/core'
import { MutableRefObject, RefObject } from 'react'

import { ILoadedModel } from 'react-babylonjs'

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
    name: string
    position: Vector3
    soundURL: string
    ref: RefObject<Mesh>
}
