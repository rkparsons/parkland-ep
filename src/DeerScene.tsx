import AmbientSound from './AmbientSound'
import DeerModel from './DeerModel'
import { FC } from 'react'
import Ground from './Ground'
import GroundProvider from './groundProvider'
import { Scene } from 'react-babylonjs'
import SkyAnimated from './SkyAnimated'
import SoundMesh from './SoundMesh'
import { Vector3 } from '@babylonjs/core'
import withPointAndClickControls from './withPointAndClickControls'
import withWaypointController from './withWaypointController'

const DeerWithPointAndClickControls = withPointAndClickControls(withWaypointController(DeerModel))

// todo: move tweakable params to .env
const DeerScene: FC = () => (
    <Scene>
        <GroundProvider GroundComponent={Ground}>
            <arcRotateCamera
                name="camera1"
                alpha={Math.PI}
                beta={Math.PI / 2.3}
                radius={20.0}
                target={Vector3.Zero()}
                minZ={0.001}
            />
            <hemisphericLight name="hemi-light" intensity={0.7} direction={Vector3.Up()} />
            <SkyAnimated />
            <DeerWithPointAndClickControls />
            <AmbientSound />
            <SoundMesh url="audio/beepMid.mp3" position={new Vector3(0, 4, 15)} />
            <SoundMesh url="audio/kickSnare.mp3" position={new Vector3(-20, 2, 5)} diameter={2} />
            <SoundMesh url="audio/pads.mp3" position={new Vector3(15, 2, -15)} diameter={3} />
        </GroundProvider>
    </Scene>
)

export default DeerScene
