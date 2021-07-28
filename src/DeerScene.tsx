import DeerModel from './DeerModel'
import { FC } from 'react'
import Ground from './Ground'
import GroundProvider from './groundProvider'
import { Scene } from 'react-babylonjs'
import SkyAnimated from './SkyAnimated'
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
        </GroundProvider>
    </Scene>
)

export default DeerScene
