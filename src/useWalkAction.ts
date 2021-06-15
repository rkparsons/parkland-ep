import { AbstractMesh, Angle, GroundMesh, Matrix, Ray, Space, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import useAnimation from './useAnimation'

function useWalkAction(
    animationName: string,
    maxSpeed: number,
    angleRef: MutableRefObject<number>,
    distVecRef: MutableRefObject<number>,
    deerRef: MutableRefObject<AbstractMesh | undefined>,
    groundRef: MutableRefObject<GroundMesh | undefined>,
    targetVecNormRef: MutableRefObject<Vector3>
) {
    const speedRef = useRef(0)
    const action = useAnimation(animationName, speedRef)

    const getSpeedFactor = () => {
        const degrees = Angle.FromRadians(angleRef.current).degrees()
        const angleFactor =
            degrees < 90 ? 1 - degrees / 90 : degrees > 270 ? (degrees - 270) / 90 : 0
        const distanceFactor =
            distVecRef.current < 2 ? 0.5 : distVecRef.current < 4 ? distVecRef.current / 4 : 1

        return angleFactor * distanceFactor
    }

    const init = () => {
        action.init()
    }

    const render = () => {
        if (!groundRef.current || !deerRef.current || !deerRef.current.rotationQuaternion) {
            return
        }

        speedRef.current = getSpeedFactor()

        if (speedRef.current > 0) {
            const walkSpeed = speedRef.current * maxSpeed
            distVecRef.current -= walkSpeed
            deerRef.current.translate(targetVecNormRef.current, walkSpeed, Space.WORLD)

            deerRef.current.moveWithCollisions(Vector3.Zero())

            // Casting a ray to get height
            let ray = new Ray(
                new Vector3(
                    deerRef.current.position.x,
                    groundRef.current.getBoundingInfo().boundingBox.maximumWorld.y + 1,
                    deerRef.current.position.z
                ),
                new Vector3(0, 0, 0)
            )
            const worldInverse = new Matrix()
            groundRef.current.getWorldMatrix().invertToRef(worldInverse)
            ray = Ray.Transform(ray, worldInverse)
            const pickInfo = groundRef.current.intersects(ray)
            if (pickInfo.hit && pickInfo.pickedPoint) {
                deerRef.current.position.y = pickInfo.pickedPoint.y + 1
            }
        }

        action.render()
    }

    return {
        init,
        render
    }
}

export default useWalkAction
