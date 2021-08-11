import { FC, ReactNode, useRef } from 'react'

import { Feature } from './types'
import { Vector3 } from '@babylonjs/core'
import WorldContext from './worldContext'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const features = useRef<Feature[]>([{ position: Vector3.Zero() }])

    return <WorldContext.Provider value={{ features }}>{children}</WorldContext.Provider>
}

export default WorldProvider
