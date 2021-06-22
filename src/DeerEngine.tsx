import { Engine, Scene, Skybox } from 'react-babylonjs'
import { FC, useRef } from 'react'
import { GroundMesh, Vector3 } from '@babylonjs/core'

import DeerWithPointAndClickControls from './deerWithPointAndClickControls'
import Ground from './Ground'

// todo: move tweakable params to .env
const DeerEngine: FC = () => {
    const ground = useRef<GroundMesh>()

    return (
        <Engine antialias adaptToDeviceRatio canvasId="canvas">
            <Scene>
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
                <DeerWithPointAndClickControls ground={ground} />
                <Ground ground={ground} />
            </Scene>
        </Engine>
    )
}

export default DeerEngine
