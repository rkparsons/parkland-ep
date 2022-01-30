import { AbstractMesh, ShadowGenerator } from '@babylonjs/core'
import { MutableRefObject, createContext } from 'react'

type WorldContext = {
    ground: MutableRefObject<AbstractMesh | undefined>
    addShadow(mesh: AbstractMesh): void
}

export default createContext<WorldContext | undefined>(undefined)
