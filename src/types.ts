import { ILoadedModel } from 'react-babylonjs'
import { Mesh } from '@babylonjs/core'
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
