import {
    AbstractMesh,
    GroundMesh,
    Matrix,
    Mesh,
    PickingInfo,
    Quaternion,
    Ray,
    Space,
    Tools,
    Vector3
} from '@babylonjs/core'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import React, { FC, Suspense, useEffect, useRef } from 'react'

import Ground from './Ground'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// import useAnimationLinked from './useAnimationLinked'
// import useAnimationOneShot from './useAnimationOneShot'

const DeerController: FC = () => {
    const groundRef = useRef<GroundMesh>()
    const deerRef = useRef<AbstractMesh>()
    const walk = useAnimation('WalkForward', deerRef)

    useBeforeRender(() => {
        if (!groundRef.current || !deerRef.current) {
            return
        }

        walk.render()
    })

    const onModelLoaded = (model: ILoadedModel) => {
        deerRef.current = model.rootMesh
        model.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

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
