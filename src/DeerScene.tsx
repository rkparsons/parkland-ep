import AmbientSound from './AmbientSound'
import CameraProvider from './CameraProvider'
import DeerModel from './DeerModel'
import { FC } from 'react'
import { Scene } from 'react-babylonjs'
import SoundMesh from './SoundMesh'
import { Vector3 } from '@babylonjs/core'
import WorldProvider from './WorldProvider'
import withPointAndClickControls from './withPointAndClickControls'
import withWaypointController from './withWaypointController'

// import SkyAnimated from './SkyAnimated'
// import Sky from './Sky'

const DeerWithPointAndClickControls = withPointAndClickControls(withWaypointController(DeerModel))

// todo: move tweakable params to .env
const DeerScene: FC = () => (
    <Scene>
        <WorldProvider>
            <CameraProvider>
                {/* <hemisphericLight name="hemi-light" intensity={1} direction={Vector3.Up()} />
                <pointLight name="sun" position={new Vector3(0, 400, 0)} intensity={1000} /> */}
                {/* <Sky /> */}
                {/* <SkyAnimated /> */}
                <DeerWithPointAndClickControls />
                <AmbientSound />
                <SoundMesh url="audio/beepMid.mp3" position={new Vector3(0, 4, 15)} />
                <SoundMesh
                    url="audio/kickSnare.mp3"
                    position={new Vector3(-20, 4, 5)}
                    diameter={2}
                />
                <SoundMesh url="audio/pads.mp3" position={new Vector3(15, 3, -15)} diameter={3} />
            </CameraProvider>
        </WorldProvider>
    </Scene>
)

export default DeerScene
