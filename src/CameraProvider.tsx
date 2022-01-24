import { AbstractMesh, ArcRotateCamera, Ray, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, useRef } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs'

import CameraContext from './cameraContext'
import useWorldContext from './useWorldContext'

type ViewProps = {
    children: ReactNode
}

const CameraProvider: FC<ViewProps> = ({ children }) => {
    const scene = useScene()
    const camera = useRef<ArcRotateCamera>()
    const { world } = useWorldContext()
    const minimumRadius = 10
    const maximumRadius = 25

    useBeforeRender(() => {
        if (!camera.current) {
            return
        }

        const ray = new Ray(camera.current.position, Vector3.Up())
        const pickingInfo = scene?.pickWithRay(ray)

        if (pickingInfo && pickingInfo.hit && pickingInfo.pickedMesh === world.current) {
            const { x, y, z } = pickingInfo.pickedPoint!
            camera.current.position = new Vector3(x, y + 1, z)

            return true
        }
    })

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
