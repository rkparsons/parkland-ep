import { FC, ReactNode, Suspense, useRef } from 'react'

import { Model } from 'react-babylonjs'
import { Vector3 } from '@babylonjs/core'
import WorldContext from './WorldContext'
import useWorldMeshes from './useWorldMeshes'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const { ground, initMeshes } = useWorldMeshes()

    return (
        <WorldContext.Provider value={{ ground }}>
            {children}
            <Suspense fallback={null}>
                <Model
                    name="world"
                    position={Vector3.Zero()}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="World.glb"
                    onModelLoaded={initMeshes}
                />
            </Suspense>
        </WorldContext.Provider>
    )
}

export default WorldProvider
