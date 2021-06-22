import { FC, MutableRefObject, ReactNode, useRef } from 'react'

import GroundContext from './groundContext'
import { GroundMesh } from '@babylonjs/core'

type ViewProps = {
    children: ReactNode
    GroundComponent: FC<{ ground: MutableRefObject<GroundMesh | undefined> }>
}

const GroundProvider: FC<ViewProps> = ({ children, GroundComponent }) => {
    const ground = useRef<GroundMesh>()

    return (
        <GroundContext.Provider value={{ ground }}>
            {children}
            <GroundComponent ground={ground} />
        </GroundContext.Provider>
    )
}

export default GroundProvider
