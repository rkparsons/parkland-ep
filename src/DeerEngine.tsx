import { Engine, ILoadedModel, Scene, Skybox } from 'react-babylonjs'
import { FC, useRef } from 'react'
import { GroundMesh, Vector3 } from '@babylonjs/core'

import DeerModel from './DeerModel'
import Ground from './Ground'
import WaypointProvider from './waypointProvider'

// todo: move tweakable params to .env
const DeerEngine: FC = () => {
    const model = useRef<ILoadedModel>()
    const ground = useRef<GroundMesh>()

    return (
        <Engine antialias adaptToDeviceRatio canvasId="canvas">
            <Scene>
                <WaypointProvider model={model} ground={ground}>
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
                    <Ground ground={ground} />
                    <DeerModel model={model} />
                </WaypointProvider>
            </Scene>
        </Engine>
    )
}

export default DeerEngine
