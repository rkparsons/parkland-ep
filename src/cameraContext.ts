import { AbstractMesh, ArcRotateCamera, Vector3 } from '@babylonjs/core'
import { MutableRefObject, createContext } from 'react'

type CameraContext = {
    camera: MutableRefObject<ArcRotateCamera | undefined>
    setLockedTarget(lockedTarget: AbstractMesh): void
    followWithCamera(position: Vector3, distanceToWaypoint: number): void
}

export default createContext<CameraContext | undefined>(undefined)
