import { AbstractMesh, GroundMesh, Quaternion, Tools, Vector3 } from '@babylonjs/core'
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs'
import React, { FC, Suspense, useRef } from 'react'

import Ground from './Ground'
import useRMAnimation from './useRMAnimation'

const DeerController: FC = () => {
    const groundRef = useRef<GroundMesh>()
    const deerRef = useRef<AbstractMesh>()
    const walk = useRMAnimation('WalkForward')

    useBeforeRender(() => {
        walk.render()
    })

    const onModelLoaded = (model: ILoadedModel) => {
        deerRef.current = model.rootMesh

        walk.init()
    }

    return (
        <>
            <Suspense fallback={null}>
                <Model
                    name="deer"
                    position={Vector3.Zero()}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="deer.glb"
                    scaleToDimension={3}
                    rotation={new Vector3(0, Tools.ToRadians(240), 0)}
                    onModelLoaded={onModelLoaded}
                    checkCollisions={true}
                    rotationQuaternion={Quaternion.Identity()}
                />
            </Suspense>
            <Ground groundRef={groundRef} />
        </>
    )
}

export default DeerController
