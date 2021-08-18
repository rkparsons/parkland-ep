import { AbstractMesh } from '@babylonjs/core'
import { createContext } from 'react'

type CameraContext = {
    setLockedTarget(lockedTarget: AbstractMesh): void
}

export default createContext<CameraContext | undefined>(undefined)
