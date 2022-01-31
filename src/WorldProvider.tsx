import { FC, ReactNode, Suspense } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'

import { Vector3 } from '@babylonjs/core'
import WorldContext from './WorldContext'
import use2Spikes from './use2Spikes'
import useAmbientSound from './useAmbientSound'
import useAudioTextMarkers from './useAudioTextMarkers'
import useGround from './useGround'
import useShards from './useShards'
import useSolids from './useSolids'
import useSpikes from './useSpikes'
import useStars from './useStars'

// import useInspector from './useInspector'

type ViewProps = {
    children: ReactNode
    setSubtitles(subtitles: string): void
}

const WorldProvider: FC<ViewProps> = ({ children, setSubtitles }) => {
    const { initShards } = useShards()
    const { initSpikes } = useSpikes()
    const { init2Spikes } = use2Spikes()
    const { initSolids } = useSolids()
    const { initStars } = useStars()
    const { initAudioTextMarkers } = useAudioTextMarkers(setSubtitles)
    // useInspector()

    useAmbientSound('desert', 'audio/desertAmbience.mp3')
    const { ground, initGround } = useGround()

    function onModelLoaded(worldModel: ILoadedModel) {
        // worldModel.meshes?.forEach((mesh) => console.log(mesh.name))

        initShards(worldModel)
        initSpikes(worldModel)
        init2Spikes(worldModel)
        initSolids(worldModel)
        initStars(worldModel)
        initGround(worldModel)
        initAudioTextMarkers(worldModel)
    }

    return (
        <WorldContext.Provider value={{ ground }}>
            {children}
            <Suspense fallback={null}>
                <Model
                    name="world"
                    position={Vector3.Zero()}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/models/`}
                    sceneFilename="World.glb"
                    onModelLoaded={onModelLoaded}
                    checkCollisions={false}
                />
            </Suspense>
        </WorldContext.Provider>
    )
}

export default WorldProvider
