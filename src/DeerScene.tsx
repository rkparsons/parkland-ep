import { Scene, Skybox } from 'react-babylonjs'

import DeerModel from './DeerModel'
import DesertGround from './DesertGround'
import { FC } from 'react'
import GroundProvider from './groundProvider'
import { Vector3 } from '@babylonjs/core'
import withPointAndClickControls from './withPointAndClickControls'

const DeerWithPointAndClickControls = withPointAndClickControls(DeerModel)

// todo: move tweakable params to .env
const DeerScene: FC = () => (
    <Scene>
        <GroundProvider GroundComponent={DesertGround}>
            <arcRotateCamera
                name="camera1"
                alpha={Math.PI / 2}
                beta={Math.PI / 2.5}
                radius={9.0}
                target={new Vector3(0, 2, 2)}
                minZ={0.001}
            />
            <hemisphericLight name="hemi-light" intensity={0.7} direction={Vector3.Up()} />
            <Skybox rootUrl={`${process.env.PUBLIC_URL}/textures/TropicalSunnyDay`} />
            <DeerWithPointAndClickControls />
        </GroundProvider>
    </Scene>
)

export default DeerScene
