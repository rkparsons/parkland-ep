import { AbstractMesh, GroundMesh, Quaternion, Tools, Vector3 } from '@babylonjs/core'
import { FC, Suspense, useRef } from 'react'
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs'

import Ground from './Ground'
import useTurnAction from './useTurnAction'
import useWalkAction from './useWalkAction'
import useWaypoint from './useWaypoint'

// todo: turn waypoint logic into provider, then animations can grab any prop needed via context
const DeerController: FC = () => {
    const angleRef = useRef<number>(0)
    const groundRef = useRef<GroundMesh>()
    const deerRef = useRef<AbstractMesh>()
    const { waypointRef, distVecRef, targetVecNormRef } = useWaypoint(groundRef, deerRef)
    const walk = useWalkAction(0.05, angleRef, distVecRef, deerRef, groundRef, targetVecNormRef)
    const turn = useTurnAction(0.02, 0.05, angleRef, distVecRef, deerRef, waypointRef)

    useBeforeRender(() => {
        walk.render()
        turn.render()
    })

    const onModelLoaded = (model: ILoadedModel) => {
        deerRef.current = model.rootMesh
        model.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        walk.init()
        turn.init()
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
            <sphere name="waypoint" ref={waypointRef} isVisible={false} />
            <Ground groundRef={groundRef} />
        </>
    )
}

export default DeerController
