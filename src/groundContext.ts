import { MutableRefObject, createContext } from 'react'

import { GroundMesh } from '@babylonjs/core'

type GroundContext = {
    ground: MutableRefObject<GroundMesh | undefined>
}

export default createContext<GroundContext | undefined>(undefined)
