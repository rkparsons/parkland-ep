import { MutableRefObject, createContext } from 'react'

import { AbstractMesh } from '@babylonjs/core'

type WorldContext = {
    ground: MutableRefObject<AbstractMesh | undefined>
}

export default createContext<WorldContext | undefined>(undefined)
