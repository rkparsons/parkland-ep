import { AbstractMesh, ShadowGenerator } from '@babylonjs/core'
import { MutableRefObject, createContext } from 'react'

type WorldContext = {
    ground: MutableRefObject<AbstractMesh | undefined>
}

export default createContext<WorldContext | undefined>(undefined)
