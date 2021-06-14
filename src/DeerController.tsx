import { AbstractMesh, GroundMesh, Quaternion, Tools, Vector3 } from '@babylonjs/core'
import { FC, Suspense, useRef } from 'react'
import { ILoadedModel, Model, Scene, useBeforeRender } from 'react-babylonjs'

import Ground from './Ground'
import useRMAnimation from './useRMAnimation'

const DeerController: FC = () => {
    const groundRef = useRef<GroundMesh>()
    const deerRef = useRef<AbstractMesh>()
    const walk = useRMAnimation('WalkForward')
    const left = useRMAnimation('TurnLeft')
    const right = useRMAnimation('TurnRight')

    useBeforeRender(() => {
        right.render()
    })

    const onModelLoaded = (model: ILoadedModel) => {
        deerRef.current = model.rootMesh

        model.animationGroups?.forEach((x) => x.stop())

        // walk.init()
        // left.init()
        right.init()
    }

    return (
        <>
            <Suspense fallback={null}>
                <Model
                    name="deer"
                    position={Vector3.Zero()}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="Deer.glb"
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
