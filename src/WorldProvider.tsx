import { DirectionalLight, ShadowGenerator, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'

import WorldContext from './WorldContext'
import use2Spikes from './use2Spikes'
import useAmbientSound from './useAmbientSound'
import useAudioTextMarkers from './useAudioTextMarkers'
import useGround from './useGround'
import useShadows from './useShadows'
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
    const { initShadows, addShadow } = useShadows()

    function onModelLoaded(worldModel: ILoadedModel) {
        // worldModel.meshes?.forEach((mesh) => console.log(mesh.name))

        initShadows(worldModel)
        initShards(worldModel, addShadow)
        initSpikes(worldModel, addShadow)
        init2Spikes(worldModel, addShadow)
        initSolids(worldModel, addShadow)
        initStars(worldModel, addShadow)
        initGround(worldModel)
        initAudioTextMarkers(worldModel)
    }

    return (
        <WorldContext.Provider value={{ ground, addShadow }}>
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
