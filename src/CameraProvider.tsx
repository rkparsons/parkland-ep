import { AbstractMesh, FollowCamera, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, useRef } from 'react'

import CameraContext from './cameraContext'

type ViewProps = {
    children: ReactNode
}

const CameraProvider: FC<ViewProps> = ({ children }) => {
    const camera = useRef<FollowCamera>()

    function setLockedTarget(mesh: AbstractMesh) {
        camera.current!.lockedTarget = mesh
    }

    return (
        <CameraContext.Provider value={{ setLockedTarget }}>
            {children}
            <followCamera
                name="camera1"
                ref={camera}
                radius={15.0}
                position={Vector3.Zero()}
                heightOffset={5}
                // lowerHeightOffsetLimit={2}
                // upperHeightOffsetLimit={8}
                // lowerRadiusLimit={10}
                // upperRadiusLimit={30}
                rotationOffset={130}
            />
        </CameraContext.Provider>
    )
}

export default CameraProvider
