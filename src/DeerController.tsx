import { FC, Suspense, useRef } from 'react'
import { GroundMesh, Quaternion, Tools, Vector3 } from '@babylonjs/core'

import Ground from './Ground'
import { Model } from 'react-babylonjs'
import usePointAndClickControls from './usePointAndClickControls'

// todo: turn waypoint logic into provider, then animations can grab any prop needed via context
const DeerController: FC = () => {
    const groundRef = useRef<GroundMesh>()
    const { waypointRef, initControls } = usePointAndClickControls(groundRef)

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
                    onModelLoaded={initControls}
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
