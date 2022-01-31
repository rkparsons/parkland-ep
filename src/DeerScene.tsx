import { Color4, Sound, StandardMaterial } from '@babylonjs/core'
import { FC, MutableRefObject, memo, useEffect } from 'react'
import { Scene, useScene } from 'react-babylonjs'

import AudioProvider from './AudioProvider'
import CameraProvider from './CameraProvider'
import DeerModel from './DeerModel'
import PostProcessing from './PostProcessing'
import WorldProvider from './WorldProvider'
import withPointAndClickControls from './withPointAndClickControls'
import withWaypointController from './withWaypointController'

// import SkyAnimated from './SkyAnimated'
// import Sky from './Sky'

const DeerWithPointAndClickControls = withPointAndClickControls(withWaypointController(DeerModel))

type ViewProps = {
    audioLoops: MutableRefObject<Sound[]>
    setSubtitles(subtitles: string): void
}
// todo: move tweakable params to .env
const DeerScene: FC<ViewProps> = ({ audioLoops, setSubtitles }) => (
    <Scene clearColor={new Color4(162 / 255, 140 / 255, 147 / 255, 1)}>
        <AudioProvider audioLoops={audioLoops}>
            <WorldProvider setSubtitles={setSubtitles}>
                <CameraProvider>
                    <DeerWithPointAndClickControls />
                    {/* <PostProcessing /> */}
                </CameraProvider>
            </WorldProvider>
        </AudioProvider>
    </Scene>
)

export default DeerScene
