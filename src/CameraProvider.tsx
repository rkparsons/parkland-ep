import { AbstractMesh, ArcRotateCamera, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, useRef } from 'react'

import CameraContext from './cameraContext'
import useWorldContext from './useWorldContext'

type ViewProps = {
    children: ReactNode
}

const CameraProvider: FC<ViewProps> = ({ children }) => {
    const camera = useRef<ArcRotateCamera>()
    const { world } = useWorldContext()
    const minimumRadius = 10
    const maximumRadius = 25

    function setLockedTarget(mesh: AbstractMesh) {
        camera.current!.lockedTarget = mesh
    }

    function lerp(value1: number, value2: number, amount: number) {
        return value1 + (value2 - value1) * amount
    }

    function followWithCamera(position: Vector3, distanceToWaypoint: number) {
        if (!camera.current) {
            return
        }

        const targetRadius = Math.min(
            Math.max(distanceToWaypoint / 2, minimumRadius),
            maximumRadius
        )

        // https://www.babylonjs-playground.com/#LYCSQ#256
        camera.current.target = position.clone()
        camera.current.radius = lerp(camera.current.radius, targetRadius, 0.05)
    }

    return (
        <CameraContext.Provider value={{ camera, setLockedTarget, followWithCamera }}>
            {children}
            <arcRotateCamera
                name="camera1"
                ref={camera}
                alpha={1.8 * Math.PI}
                beta={0.4 * Math.PI}
                radius={15}
                target={Vector3.Zero()}
            />
        </CameraContext.Provider>
    )
}

export default CameraProvider
