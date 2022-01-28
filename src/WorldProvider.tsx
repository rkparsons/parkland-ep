import { FC, ReactNode, Suspense, memo, useEffect, useRef } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'
import { Sound, Vector3 } from '@babylonjs/core'

import WorldContext from './WorldContext'
import useGround from './useGround'
import useShards from './useShards'
import useSolids from './useSolids'
import useSpikes from './useSpikes'
import useStars from './useStars'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    console.log('WorldProvider')
    const { initShards } = useShards()
    const { initSpikes } = useSpikes()
    const { initSolids } = useSolids()
    const { initStars } = useStars()
    const { ground, initGround } = useGround()

    function onModelLoaded(worldModel: ILoadedModel) {
        initShards(worldModel)
        initSpikes(worldModel)
        initSolids(worldModel)
        initStars(worldModel)
        initGround(worldModel)
    }

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
                    onModelLoaded={onModelLoaded}
                />
            </Suspense>
        </WorldContext.Provider>
    )
}

export default WorldProvider
