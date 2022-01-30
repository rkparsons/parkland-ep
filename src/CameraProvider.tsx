import { AbstractMesh, ArcRotateCamera, Color3, Mesh, Ray, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, useRef } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs'

import CameraContext from './cameraContext'
import { isMobile } from 'react-device-detect'
import useWorldContext from './useWorldContext'

type ViewProps = {
    children: ReactNode
}

const CameraProvider: FC<ViewProps> = ({ children }) => {
    const scene = useScene()
    const camera = useRef<ArcRotateCamera>()
    const { ground } = useWorldContext()
    const minimumRadius = isMobile ? 14 : 10
    const maximumRadius = 25

    function setLockedTarget(mesh: AbstractMesh) {
        camera.current!.lockedTarget = mesh
    }

    function lerp(value1: number, value2: number, amount: number) {
        return value1 + (value2 - value1) * amount
    }

    function forceAboveGround() {
        if (!camera.current) {
            return
        }

        const ray = new Ray(camera.current.position.add(Vector3.Down().scale(20)), Vector3.Up())
        const pickingInfo = scene?.pickWithRay(ray)

        if (pickingInfo && pickingInfo.hit && pickingInfo.pickedMesh === ground.current) {
            const { x, y, z } = pickingInfo.pickedPoint!
            camera.current.position = Vector3.Lerp(
                camera.current.position,
                new Vector3(x, y + 2, z),
                0.05
            )
        }
    }

    function forceLineOfSight(characterPosition: Vector3) {
        if (!camera.current) {
            return
        }

        const cameraToCharacter = characterPosition
            .add(Vector3.Up().scale(2))
            .subtract(camera.current.position)
        const rayLength = Vector3.Distance(camera.current.position, characterPosition)
        const rayDirection = Vector3.Normalize(cameraToCharacter)
        const ray = new Ray(camera.current.position, rayDirection, rayLength)
        const pickingInfo = scene?.pickWithRay(ray)

        if (pickingInfo && pickingInfo.hit && pickingInfo.pickedMesh === ground.current) {
            const { x, y, z } = camera.current.position
            camera.current.position = Vector3.Lerp(
                camera.current.position,
                new Vector3(x, y + 1, z),
                0.01
            )
        }
    }

    function followWithCamera(characterPosition: Vector3, distanceToWaypoint: number) {
        if (!camera.current) {
            return
        }

        forceAboveGround()
        forceLineOfSight(characterPosition)

        const targetRadius = Math.min(
            Math.max(distanceToWaypoint / 2, minimumRadius),
            maximumRadius
        )

        // https://www.babylonjs-playground.com/#LYCSQ#256
        camera.current.target = characterPosition.clone()
        camera.current.radius = lerp(camera.current.radius, targetRadius, 0.05)
    }

    return (
        <CameraContext.Provider value={{ camera, setLockedTarget, followWithCamera }}>
            {children}
            <arcRotateCamera
                name="camera1"
                ref={camera}
                alpha={2.6 * Math.PI}
                beta={0.42 * Math.PI}
                radius={18}
                target={new Vector3(89.21744186810362, 81.00960779873975, 97.87237428264427)}
            />
        </CameraContext.Provider>
    )
}

export default CameraProvider
