import CameraProvider from './CameraProvider'
import { Color4 } from '@babylonjs/core'
import DeerModel from './DeerModel'
import { FC } from 'react'
import { Scene } from 'react-babylonjs'
import WorldProvider from './WorldProvider'
import withPointAndClickControls from './withPointAndClickControls'
import withWaypointController from './withWaypointController'

// import AmbientSound from './AmbientSound'
// import SkyAnimated from './SkyAnimated'
// import Sky from './Sky'

const DeerWithPointAndClickControls = withPointAndClickControls(withWaypointController(DeerModel))

// todo: move tweakable params to .env
const DeerScene: FC = () => (
    <Scene clearColor={new Color4(162 / 255, 140 / 255, 147 / 255, 1)}>
        <WorldProvider>
            <CameraProvider>
                {/* <hemisphericLight name="hemi-light" intensity={1} direction={Vector3.Up()} />
                <pointLight name="sun" position={new Vector3(0, 400, 0)} intensity={1000} /> */}
                {/* <Sky /> */}
                {/* <SkyAnimated /> */}
                <DeerWithPointAndClickControls />
                {/* <AmbientSound /> */}
            </CameraProvider>
        </WorldProvider>
    </Scene>
)

export default DeerScene
