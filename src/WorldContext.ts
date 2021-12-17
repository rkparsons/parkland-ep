import { MutableRefObject, createContext } from 'react'

import { AbstractMesh } from '@babylonjs/core'

type WorldContext = {
    world: MutableRefObject<AbstractMesh | undefined>
}

export default createContext<WorldContext | undefined>(undefined)
