import { AbstractMesh, FollowCamera } from '@babylonjs/core'
import { MutableRefObject, createContext } from 'react'

type CameraContext = {
    camera: MutableRefObject<FollowCamera | undefined>
    setLockedTarget(lockedTarget: AbstractMesh): void
    adjustZoomToWaypointDistance(distanceToWaypoint: number): void
}

export default createContext<CameraContext | undefined>(undefined)
