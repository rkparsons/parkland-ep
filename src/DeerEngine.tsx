import { Engine, Scene, Skybox } from 'react-babylonjs'

import DeerModel from './DeerModel'
import { FC } from 'react'
import Ground from './Ground'
import InputMapProvider from './InputMapProvider'
import { Vector3 } from '@babylonjs/core'
import withPointAndClickControls from './withPointAndClickControls'

const DeerModelWithPointAndClickControls = withPointAndClickControls(DeerModel, Ground)

// todo: move tweakable params to .env
const DeerEngine: FC = () => (
    <Engine antialias adaptToDeviceRatio canvasId="canvas">
        <Scene>
            <InputMapProvider>
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
                <DeerModelWithPointAndClickControls />
            </InputMapProvider>
        </Scene>
    </Engine>
)

export default DeerEngine
