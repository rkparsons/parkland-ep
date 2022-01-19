import { AbstractMesh, FollowCamera, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, useRef } from 'react'

import CameraContext from './cameraContext'

type ViewProps = {
    children: ReactNode
}

const CameraProvider: FC<ViewProps> = ({ children }) => {
    const camera = useRef<FollowCamera>()
    const minimumRadius = 10
    const maximumRadius = 25

    function setLockedTarget(mesh: AbstractMesh) {
        camera.current!.lockedTarget = mesh
    }

    function adjustZoomToWaypointDistance(distanceToWaypoint: number) {
        if (camera.current) {
            camera.current.cameraAcceleration = 0.01
            camera.current.radius = Math.min(
                Math.max(distanceToWaypoint / 2, minimumRadius),
                maximumRadius
            )
            camera.current.lowerRadiusLimit = camera.current.radius
            camera.current.upperRadiusLimit = camera.current.radius
        }
    }

    return (
        <CameraContext.Provider value={{ camera, setLockedTarget, adjustZoomToWaypointDistance }}>
            {children}
            <followCamera
                name="camera1"
                ref={camera}
                radius={15.0}
                position={new Vector3(0, 360.5, 0)}
                heightOffset={5}
                rotationOffset={130}
            />
        </CameraContext.Provider>
    )
}

export default CameraProvider
